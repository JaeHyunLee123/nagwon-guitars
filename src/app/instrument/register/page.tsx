"use client";

import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useSession } from "@/hooks/useSession";
import { zodResolver } from "@hookform/resolvers/zod";
import { InstrumentType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { convertBlobUrlToFile } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export const instrumentRegisterFormSchema = z.object({
  brand: z.string(),
  name: z.string(),
  price: z.string().regex(/^[\d]+$/, "숫자만 입력해주세요"),
  stock: z.string().regex(/^[\d]+$/, "숫자만 입력해주세요"),
  isUsed: z.enum(["new", "used"]),
  instrumentImage: z.string(),
  specificationImage: z.string().optional(),
  specificationText: z.string().optional(),
  instrumentType: z.nativeEnum(InstrumentType),
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

  const registerForm = useForm<z.infer<typeof instrumentRegisterFormSchema>>({
    resolver: zodResolver(instrumentRegisterFormSchema),
    mode: "onChange",
  });

  const { toast } = useToast();
  const { mutate } = useMutation({
    mutationFn: (data: z.infer<typeof instrumentRegisterFormSchema>) => {
      return axios.post("/api/instrument/register", data);
    },
    onSuccess: () => {
      toast({
        title: "악기 등록 성공",
        description: `등록 악기: ${registerForm.getValues("name")}`,
        variant: "success",
      });
    },
  });

  const onSubmit = async (
    form: z.infer<typeof instrumentRegisterFormSchema>
  ) => {
    const instrumentImage = await convertBlobUrlToFile(form.instrumentImage);
    const specificationImage = form.specificationImage
      ? await convertBlobUrlToFile(form.specificationImage)
      : null;

    const instrumentImageName = `instrument-${
      session?.userId
    }-${Date.now()}-image.${instrumentImage.name.split(".").pop()}`;

    const specificationImageName = specificationImage
      ? `instrument-${
          session?.userId
        }-${Date.now()}-specification.${specificationImage.name
          .split(".")
          .pop()}`
      : undefined;

    await supabase.storage
      .from("instrument-image")
      .upload(instrumentImageName, instrumentImage);

    if (specificationImage && specificationImageName) {
      await supabase.storage
        .from("instrument-specification")
        .upload(specificationImageName, specificationImage);
    }

    form.instrumentImage = instrumentImageName;
    form.specificationImage = specificationImageName;

    mutate(form);
  };

  const [instrumentPreview, setInstrumentPreview] = useState("");

  const onInstrumentImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const file = event.target.files[0];

    if (file.size > 60_000_000) {
      registerForm.setError("instrumentImage", {
        message: "5mb보다 작은 이미지를 입력해주세요.",
      });
      return;
    }

    //check if the file is an image
    if (!file.type.startsWith("image")) {
      registerForm.setError("instrumentImage", {
        message: "이미지 파일을 입력해주세요.",
      });
      return;
    }

    console.log(file);

    const imageUrl = URL.createObjectURL(file);

    setInstrumentPreview(imageUrl);

    registerForm.setValue("instrumentImage", imageUrl);
  };

  const onSpecificationImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const file = event.target.files[0];

    if (file.size > 60_000_000) {
      registerForm.setError("specificationImage", {
        message: "5mb보다 작은 이미지를 입력해주세요.",
      });
      return;
    }

    //check if the file is an image
    if (!file.type.startsWith("image")) {
      registerForm.setError("instrumentImage", {
        message: "이미지 파일을 입력해주세요.",
      });
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    registerForm.setValue("specificationImage", imageUrl);
  };

  return (
    <main className="p-2 flex flex-col items-center">
      <span className="font-bold text-2xl">악기 등록</span>
      {session?.isApproved ? (
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(onSubmit)}
            className="w-[90%] max-w-[40rem] flex flex-col space-y-2"
          >
            <FormField
              control={registerForm.control}
              name="brand"
              render={({ field }) => (
                <FormItem className="w-[90%]">
                  <FormLabel>악기 브랜드</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-[90%]">
                  <FormLabel>악기 이름</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-[90%]">
                  <FormLabel>악기 가격</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        {...field}
                        type="number"
                        className="rounded-r-none"
                      />
                      <span
                        className={
                          "flex items-center justify-left h-9 w-[10%] rounded-l-none rounded-md border border-input bg-transparent px-3 py-1 text-center shadow-sm transition-colors md:text-sm"
                        }
                      >
                        원
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="stock"
              render={({ field }) => (
                <FormItem className="w-[90%]">
                  <FormLabel>악기 재고</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        {...field}
                        type="number"
                        className="rounded-r-none"
                      />
                      <span
                        className={
                          "flex items-center justify-left h-9 w-[10%] rounded-l-none rounded-md border border-input bg-transparent px-3 py-1 text-center shadow-sm transition-colors md:text-sm"
                        }
                      >
                        개
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="isUsed"
              render={({ field }) => (
                <FormItem className="w-[90%]">
                  <FormLabel>신품 / 중고</FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex flex-row"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={"new"} id="new" />
                        <Label>신품</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={"used"} id="used" />
                        <Label>중고</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="instrumentImage"
              render={(field) => (
                <FormItem className="w-[90%]">
                  <FormLabel className="flex flex-col">
                    <span>악기 사진</span>
                  </FormLabel>
                  <FormControl>
                    <div>
                      {instrumentPreview ? (
                        <Image
                          src={instrumentPreview}
                          alt="picture of the instrument"
                          width={200}
                          height={200}
                        />
                      ) : (
                        ""
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        alt="악기 사진"
                        onChange={onInstrumentImageChange}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="specificationImage"
              render={(field) => (
                <FormItem className="w-[90%]">
                  <FormLabel className="flex flex-col">
                    <span>악기 설명 사진 (옵션)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      alt="상세 사진"
                      onChange={onSpecificationImageChange}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="specificationText"
              render={({ field }) => (
                <FormItem className="w-[90%]">
                  <FormLabel>악기 설명 (옵션)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="instrumentType"
              render={({ field }) => (
                <FormItem className="w-[90%]">
                  <FormLabel>악기 종류</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="악기 종류" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Guitar">기타</SelectItem>
                        <SelectItem value="Bass">베이스</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={registerForm.formState.isSubmitting}
            >
              등록
            </Button>
          </form>
        </Form>
      ) : (
        <span>아직 승인 대기 중입니다.</span>
      )}
    </main>
  );
}
