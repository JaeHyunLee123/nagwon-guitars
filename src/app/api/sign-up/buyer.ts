import { db } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import bcrypt from "bcrypt";

interface ResponseData {
  message: string;
}

const BodyValidator = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  passwordConfirmation: z.string(),
  name: z.string().min(2),
  phoneNumber: z.string().regex(/^[\d]+$/),
});

const post = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    const { email, password, name, phoneNumber } = BodyValidator.parse(
      req.body
    );

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

    res.status(200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(422).json({ message: "invalid form" });
    }

    res.status(500).json({ message: "unexpected server error" });
  }
};

const handler = (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  if (req.method === "post") {
    post(req, res);
  }
};

export default handler;
