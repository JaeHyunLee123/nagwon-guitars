import { db } from "@/lib/db";
import getIronSessionData from "@/lib/session";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";

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

    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "unexpected server error" },
      { status: 500 }
    );
  }
}

const BodyValidator = z.object({
  email: z.string().email("이메일 포맷에 맞게 작성해주세요."),
  password: z.string().min(10, "비밀번호는 최소 10글자 이상이여야 합니다."),
  passwordConfirmation: z.string(),
  name: z.string().min(2, "이름은 최소 2글자 이상이여야 합니다."),
  phoneNumber: z.string().regex(/^[\d]+$/, "숫자만 입력해주세요"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password, name, phoneNumber } = BodyValidator.parse(body);

    const session = await getIronSessionData();

    if (!session.isLoggedIn || !session.userId) {
      return Response.json({ message: "log in first" }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.findUnique({
      where: {
        id: session.userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return Response.json({ message: "no user info" }, { status: 404 });
    }

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: email,
        password: hashedPassword,
        name: name,
        userPhoneNumber: phoneNumber,
      },
    });

    console.log("hi");
    return Response.json({ message: "ok" }, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return Response.json({ message: "invalid form" }, { status: 422 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === "P2002") {
        return Response.json(
          { message: "this email is already in use" },
          { status: 409 }
        );
      }
    }
    return Response.json(
      { message: "unexpected server error" },
      { status: 500 }
    );
  }
}
