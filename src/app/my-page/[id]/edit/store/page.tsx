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
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const storeInfoSchema = z.object({
  storePhoneNumber: z.string().regex(/^[\d]+$/, "숫자만 입력해주세요"),
  storeWebsite: z
    .string()
    .url("올바른 웹사이트 주소를 입력해주세요.")
    .optional(),
  storeAddress: z.string(),
  storeName: z.string(),
});

export default function EditStore({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //1. get id
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const fetchId = async () => {
      const { id } = await params;
      setUserId(id);
    };
    fetchId();
  }, [params, userId]);

  //2. get store info - need api
  const {
    data: store,
    isFetched,
    refetch,
  } = useQuery<Store>({
    queryKey: ["store"],
    queryFn: async () => {
      const res = await axios.get("/api/store", {
        params: { sellerId: userId },
      });
      return res.data;
    },
    enabled: false,
  });

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  //3. make form
  const storeForm = useForm<z.infer<typeof storeInfoSchema>>({
    resolver: zodResolver(storeInfoSchema),
    mode: "onChange",
  });

  //set default value
  useEffect(() => {
    if (isFetched && store) {
      storeForm.setValue("storePhoneNumber", store?.storePhoneNumber);
      storeForm.setValue("storeName", store?.storeName);
      storeForm.setValue("storeWebsite", store?.webSite || "");
      storeForm.setValue("storeAddress", store?.address);
    }
  }, [isFetched, store, storeForm]);

  const onSubmit = (form: z.infer<typeof storeInfoSchema>) => {
    console.log(form);
    mutate(form);
  };

  const { toast } = useToast();
  const router = useRouter();
  //4. update - need api

  const { mutate, isPending } = useMutation({
    mutationFn: (form: z.infer<typeof storeInfoSchema>) => {
      return axios.post("/api/store", form);
    },
    onSuccess: () => {
      toast({
        title: "매장 정보를 수정했습니다.",
        variant: "success",
      });
      router.push(`/my-page/${userId}`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          toast({
            title: "로그인을 먼저 해주세요.",
            variant: "destructive",
          });
        } else if (error.response?.status === 403) {
          toast({
            title: "매장 정보를 찾을 수 없습니다.",
            variant: "destructive",
          });
        } else if (error.response?.status === 422) {
          toast({
            title: "옳지 않은 폼 제출입니다.",
            description: "올바른 정보를 입력해주세요.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "알 수 없는 서버 에러입니다.",
            description: "잠시 후 다시 시도해주세요.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "알 수 없는 서버 에러입니다.",
          description: "잠시 후 다시 시도해주세요.",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <main className="flex flex-col space-y-4 items-center">
      <span className="text-xl font-bold mt-4">매장 정보 수정</span>
      <Form {...storeForm}>
        <form
          onSubmit={storeForm.handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center space-y-2 w-[90%] max-w-[25rem] border border-1 rounded-md m-4 p-4"
        >
          <FormField
            control={storeForm.control}
            name="storeName"
            render={({ field }) => (
              <FormItem className="w-[90%]">
                <FormLabel>매장 이름</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={storeForm.control}
            name="storePhoneNumber"
            render={({ field }) => (
              <FormItem className="w-[90%]">
                <FormLabel>매장 번호</FormLabel>
                <FormControl>
                  <Input {...field} type={"tel"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={storeForm.control}
            name="storeAddress"
            render={({ field }) => (
              <FormItem className="w-[90%]">
                <FormLabel>매장 주소</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={storeForm.control}
            name="storeWebsite"
            render={({ field }) => (
              <FormItem className="w-[90%]">
                <FormLabel>매장 웹사이트</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            매장 정보 수정
          </Button>
        </form>
      </Form>
    </main>
  );
}
