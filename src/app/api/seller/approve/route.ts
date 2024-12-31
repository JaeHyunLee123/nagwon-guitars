import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const BodyValidator = z.object({
  sellerId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { sellerId } = BodyValidator.parse(body);

    await db.user.update({
      where: {
        id: sellerId,
      },
      data: {
        isApproved: true,
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
