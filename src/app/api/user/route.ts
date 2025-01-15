import { db } from "@/lib/db";
import getIronSessionData from "@/lib/session";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const session = await getIronSessionData();

    if (!session.isLoggedIn || !session.userId) {
      return Response.json({ message: "log in first" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: {
        id: session.userId,
      },
    });

    if (!user) {
      return Response.json(
        { massage: "can't find user infomation" },
        { status: 404 }
      );
    }

    console.log(user);

    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "unexpected server error" },
      { status: 500 }
    );
  }
}
