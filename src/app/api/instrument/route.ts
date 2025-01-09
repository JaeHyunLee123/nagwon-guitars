import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import getIronSessionData from "@/lib/session";
import { InstrumentType } from "@prisma/client";

const BodyValidator = z.object({
  brand: z.string(),
  name: z.string(),
  price: z.string().regex(/^[\d]+$/, "숫자만 입력해주세요"),
  stock: z.string().regex(/^[\d]+$/, "숫자만 입력해주세요"),
  isUsed: z.enum(["new", "used"]),
  instrumentImage: z.string(),
  specificationImage: z.string().optional(),
  specificationText: z.string().optional(),
  instrumentType: z.nativeEnum(InstrumentType),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log(body);

    const instrumentInfo = BodyValidator.parse(body);

    const session = await getIronSessionData();

    if (session.role !== "Seller" || !session.isApproved) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const seller = await db.user.findUnique({
      where: {
        id: session.userId,
      },
      include: {
        store: true,
      },
    });

    if (!seller || !seller.store) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    await db.instrument.create({
      data: {
        brand: instrumentInfo.brand,
        name: instrumentInfo.name,
        price: parseInt(instrumentInfo.price),
        stock: parseInt(instrumentInfo.stock),
        isUsed: instrumentInfo.isUsed === "new" ? false : true,
        instrumentImage: instrumentInfo.instrumentImage,
        specificationImage: instrumentInfo.specificationImage,
        specificationText: instrumentInfo.specificationText,
        type: instrumentInfo.instrumentType,
        storeId: seller.store.id,
      },
    });

    return Response.json({ message: "ok" }, { status: 200 });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return Response.json({ message: "invalid form" }, { status: 422 });
    }

    return Response.json(
      { message: "unexpected server error" },
      { status: 500 }
    );
  }
}
