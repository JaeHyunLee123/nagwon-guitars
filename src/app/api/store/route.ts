import { db } from "@/lib/db";
import getIronSessionData from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const sellerId = params.get("sellerId");

    if (!sellerId) {
      return Response.json({ message: "invalid id" }, { status: 422 });
    }

    const store = await db.store.findUnique({
      where: {
        userId: sellerId,
      },
    });

    if (!store) {
      return Response.json({ message: "no store" }, { status: 403 });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "unexpected server error" },
      { status: 500 }
    );
  }
}

const bodyValidater = z.object({
  storePhoneNumber: z.string().regex(/^[\d]+$/, "숫자만 입력해주세요"),
  storeWebsite: z
    .string()
    .url("올바른 웹사이트 주소를 입력해주세요.")
    .optional(),
  storeAddress: z.string(),
  storeName: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { storeAddress, storeName, storePhoneNumber, storeWebsite } =
      bodyValidater.parse(body);

    const session = await getIronSessionData();

    if (
      !(session.isLoggedIn && session.isApproved && session.role === "Seller")
    ) {
      return Response.json({ message: "invalid id" }, { status: 422 });
    }

    const store = await db.store.findUnique({
      where: {
        userId: session.userId,
      },
    });

    if (!store) {
      return Response.json({ message: "no store" }, { status: 403 });
    }

    await db.store.update({
      where: {
        id: store.id,
      },
      data: {
        storeName,
        storePhoneNumber,
        address: storeAddress,
        webSite: storeWebsite ? storeWebsite : store.webSite,
      },
    });

    return Response.json({ message: "ok" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.stack);
    } else {
      console.error(error);
    }

    if (error instanceof z.ZodError) {
      return Response.json({ message: "invalid form" }, { status: 422 });
    }
    return Response.json(
      { message: "unexpected server error" },
      { status: 500 }
    );
  }
}
