import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import getIronSessionData from "@/lib/session";

const ParamsValidator = z.object({
  email: z.string().email(),
  password: z.string().min(10),
});

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const { email, password } = ParamsValidator.parse({
      email: params.get("email"),
      password: params.get("password"),
    });

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
    if (error instanceof z.ZodError) {
      return Response.json({ message: "invalid form" }, { status: 422 });
    }

    return Response.json(
      { message: "unexpected server error" },
      { status: 500 }
    );
  }
}
