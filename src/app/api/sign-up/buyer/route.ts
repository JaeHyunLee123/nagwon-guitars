import { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

const BodyValidator = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  name: z.string().min(2),
  phoneNumber: z.string().regex(/^[\d]+$/),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password, name, phoneNumber } = BodyValidator.parse(body);

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        userPhoneNumber: phoneNumber,
        isApproved: true,
        role: "Buyer",
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
