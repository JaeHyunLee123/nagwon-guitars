import { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

const BodyValidator = z.object({
  email: z.string().email("이메일 포맷에 맞게 작성해주세요."),
  password: z.string().min(10, "비밀번호는 최소 10글자 이상이여야 합니다."),
  passwordConfirmation: z.string(),
  name: z.string().min(2, "이름은 최소 2글자 이상이여야 합니다."),
  userPhoneNumber: z.string().regex(/^[\d]+$/, "숫자만 입력해주세요"),
  storePhoneNumber: z.string().regex(/^[\d]+$/, "숫자만 입력해주세요"),
  storeWebsite: z
    .string()
    .url("올바른 웹사이트 주소를 입력해주세요.")
    .optional(),
  storeAddress: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log(body);
    const {
      email,
      password,
      name,
      userPhoneNumber,
      storeAddress,
      storePhoneNumber,
      storeWebsite,
    } = BodyValidator.parse(body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        userPhoneNumber,
        isApproved: false,
        role: "Seller",
      },
    });

    await db.store.create({
      data: {
        userId: newUser.id,
        webSite: storeWebsite,
        storePhoneNumber,
        address: storeAddress,
      },
    });

    return Response.json({ message: "ok" }, { status: 200 });
  } catch (error) {
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
