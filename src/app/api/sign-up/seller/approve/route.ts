import { NextRequest } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

const BodyValidator = z.object({});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {} = BodyValidator.parse(body);

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
