import { db } from "@/lib/db";
import getIronSessionData from "@/lib/session";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const password = params.get("password");

    if (!password) {
      return Response.json({ message: "no password" }, { status: 400 });
    }

    const session = await getIronSessionData();

    if (!session || !session.isLoggedIn) {
      return Response.json(
        {
          message: "no session",
        },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: {
        id: session.userId,
      },
    });

    if (!user) {
      return Response.json(
        {
          message: "no user info",
        },
        { status: 404 }
      );
    }

    const isPasswordSame = await bcrypt.compare(password, user.password);

    if (!isPasswordSame) {
      return Response.json(
        {
          message: "password not same",
        },
        { status: 403 }
      );
    }

    return Response.json({ message: "ok" }, { status: 200 });
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "unexpected server error" },
      { status: 500 }
    );
  }
}
