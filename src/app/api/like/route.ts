import { db } from "@/lib/db";
import getIronSessionData from "@/lib/session";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getIronSessionData();

    if (!session || !session.isLoggedIn) {
      return Response.json({ isLike: false }, { status: 200 });
    }

    const params = req.nextUrl.searchParams;
    const instrumentId = params.get("instrumentId");

    if (!instrumentId) {
      return Response.json({ message: "no prop" }, { status: 403 });
    }

    const instrument = await db.instrument.findUnique({
      where: {
        id: instrumentId,
      },
      include: {
        liked: true,
      },
    });

    if (!instrument) {
      return Response.json({ message: "no instrument" }, { status: 404 });
    }

    const isLike = instrument.liked.filter((user) => {
      return user.id === session.userId;
    });

    if (isLike.length > 0) {
      return Response.json({ isLike: true }, { status: 200 });
    } else {
      return Response.json({ isLike: false }, { status: 200 });
    }
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "unexpected server error" },
      { status: 500 }
    );
  }
}
