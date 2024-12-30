import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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
