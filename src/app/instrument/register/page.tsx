"use client";

import { useSession } from "@/hooks/useSession";
import { InstrumentType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { z } from "zod";

const imageFileValidator = z.string().refine(
  (value) => {
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
    return validExtensions.some((ext) => value.toLowerCase().endsWith(ext));
  },
  {
    message:
      "File must be an image with a valid extension (.jpg, .jpeg, .png, .gif, .bmp).",
  }
);

const instrumentRegisterFormSchema = z.object({
  instrumentImages: z.array(imageFileValidator),
  price: z.number().int().min(1),
  stock: z.number().int().min(0),
  isUsed: z.boolean(),
  instrumentType: z.nativeEnum(InstrumentType),
  specificationImages: z.array(imageFileValidator),
  specificationTexts: z.string().array().optional(),
});

export default function InstrumentRegister() {
  const { data: session, isPending } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (session?.role !== "Seller") {
        router.push("/");
      }
    }
  }, [isPending, router, session]);

  return (
    <main>
      <span className="font-bold text-2xl">악기 등록</span>
      {session?.isApproved ? (
        <div></div>
      ) : (
        <span>아직 승인 대기 중입니다.</span>
      )}
    </main>
  );
}
