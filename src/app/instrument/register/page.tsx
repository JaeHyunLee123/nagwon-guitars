"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { useSession } from "@/hooks/useSession";
import { zodResolver } from "@hookform/resolvers/zod";
import { InstrumentType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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

  const registerForm = useForm<z.infer<typeof instrumentRegisterFormSchema>>({
    resolver: zodResolver(instrumentRegisterFormSchema),
    mode: "onChange",
  });

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
        <Form {...registerForm}>
          <form>
            <FormField
              control={registerForm.control}
              name="instrumentImages"
              render={({ field }) => (
                <FormItem className="w-[90%]">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@example.com"
                      type={"email"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      ) : (
        <span>아직 승인 대기 중입니다.</span>
      )}
    </main>
  );
}
