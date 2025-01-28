import { db } from "@/lib/db";
import getIronSessionData from "@/lib/session";
import { NextRequest } from "next/server";
import { z } from "zod";

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
        likeds: true,
      },
    });

    if (!instrument) {
      return Response.json({ message: "no instrument" }, { status: 404 });
    }

    const isLike = instrument.likeds.filter((user) => {
      return user.userId === session.userId;
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

const BodyValidator = z.object({
  isLike: z.boolean(),
  instrumentId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getIronSessionData();

    if (!session || !session.isLoggedIn) {
      return Response.json({ message: "login first" }, { status: 401 });
    }

    const body = await req.json();

    const { isLike, instrumentId } = BodyValidator.parse(body);

    const instrument = await db.instrument.findUnique({
      where: {
        id: instrumentId,
      },
      select: {
        id: true,
      },
    });

    if (!instrument) {
      return Response.json({ message: "no instrument" }, { status: 404 });
    }

    const user = await db.user.findUnique({
      where: {
        id: session.userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return Response.json({ message: "no user info" }, { status: 403 });
    }

    if (isLike) {
      await db.userLikesInstrument.create({
        data: {
          userId: user.id,
          instrumentId: instrument.id,
        },
      });
    } else {
      await db.userLikesInstrument.deleteMany({
        where: {
          userId: user.id,
          instrumentId: instrument.id,
        },
      });
    }

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
