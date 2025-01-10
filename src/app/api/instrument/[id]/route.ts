import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const instrument = await db.instrument.findUnique({
      where: {
        id,
      },
      include: {
        store: true,
      },
    });

    if (!instrument) {
      return Response.json({ message: "no instrument" }, { status: 404 });
    }

    return Response.json(instrument, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "unexpected server error" },
      { status: 500 }
    );
  }
}
