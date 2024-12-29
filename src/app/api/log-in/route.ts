import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import getIronSessionData from "@/lib/session";

const BodyValidator = z.object({
  email: z.string().email(),
  password: z.string().min(10),
});

export async function GET(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = BodyValidator.parse(body);

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return Response.json(
        {
          message: "no email",
        },
        { status: 409 }
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

    const session = await getIronSessionData();

    session.email = user.email;
    session.isApproved = user.isApproved;
    session.role = user.role;
    session.username = user.name;
    session.userId = user.id;
    session.isLoggedIn = true;

    await session.save();

    return Response.json({ message: "ok" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "unexpected server error" },
      { status: 500 }
    );
  }
}
