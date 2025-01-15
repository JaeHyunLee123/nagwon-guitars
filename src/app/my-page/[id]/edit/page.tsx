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
import { User } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const userInfoFormSchema = z
  .object({
    email: z.string().email("이메일 포맷에 맞게 작성해주세요."),
    password: z.string().min(10, "비밀번호는 최소 10글자 이상이여야 합니다."),
    passwordConfirmation: z.string(),
    name: z.string().min(2, "이름은 최소 2글자 이상이여야 합니다."),
    phoneNumber: z.string().regex(/^[\d]+$/, "숫자만 입력해주세요"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "비밀번호가 서로 같지 않습니다.",
    path: ["passwordConfirmation"], // Error will be associated with passwordConfirmation
  });

export default function EditUser({
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

  //2. get user data
  const { data: user, isFetched } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get("/api/user");
      return res.data;
    },
  });

  const router = useRouter();
  const { toast } = useToast();
  //2-1. check whether another user is try to connect another user's edit page
  useEffect(() => {
    if (!(userId && user)) return;

    if (userId !== user.id) {
      toast({
        title: "올바르지 못한 접근",
        description: "본인의 정보만 수정할 수 있습니다.",
        variant: "destructive",
      });
      router.push("/");
    }
  }, [user, router, toast, userId]);

  //3. make form
  const userInfoForm = useForm<z.infer<typeof userInfoFormSchema>>({
    resolver: zodResolver(userInfoFormSchema),
  });
  //set default value
  useEffect(() => {
    if (isFetched && user) {
      userInfoForm.setValue("email", user.email);
      userInfoForm.setValue("name", user.name);
      userInfoForm.setValue("phoneNumber", user.userPhoneNumber);
    }
  }, [isFetched, user, userInfoForm]);

  //4. update user data - have to make api
  const { mutate, isPending } = useMutation({
    mutationFn: (form: z.infer<typeof userInfoFormSchema>) => {
      return axios.post("/api/user", form);
    },
    onSuccess: () => {
      toast({
        title: "정보를 업데이트 했습니다.",
        variant: "success",
      });
      router.push(`/my-page/${userId}`);
    },
  });

  const onSubmit = (form: z.infer<typeof userInfoFormSchema>) => {
    mutate(form);
  };

  return (
    <main className="flex flex-col space-y-4 items-center">
      <span className="text-xl font-bold mt-4">회원 정보 수정</span>
      <Form {...userInfoForm}>
        <form
          onSubmit={userInfoForm.handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center space-y-2 w-[90%] max-w-[25rem] border border-1 rounded-md m-4 p-4"
        >
          <FormField
            control={userInfoForm.control}
            name="email"
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
          <FormField
            control={userInfoForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-[90%]">
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input type={"password"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={userInfoForm.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem className="w-[90%]">
                <FormLabel>비밀번호 확인</FormLabel>
                <FormControl>
                  <Input type={"password"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={userInfoForm.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-[90%]">
                <FormLabel>성함</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={userInfoForm.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="w-[90%]">
                <FormLabel>핸드폰 번호</FormLabel>
                <FormControl>
                  <Input {...field} type={"tel"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            회원 정보 수정
          </Button>
        </form>
      </Form>
    </main>
  );
}
