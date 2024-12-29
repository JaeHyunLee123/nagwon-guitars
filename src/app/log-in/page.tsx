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
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const logInFormSchema = z.object({
  email: z.string().email("이메일 포맷에 맞게 작성해주세요."),
  password: z.string().min(10, "비밀번호는 최소 10글자 이상이여야 합니다."),
});

const LogIn = () => {
  const logInForm = useForm<z.infer<typeof logInFormSchema>>({
    resolver: zodResolver(logInFormSchema),
    mode: "onChange",
  });

  const onSubmit = (form: z.infer<typeof logInFormSchema>) => {
    console.log(form);
  };

  return (
    <main className="flex flex-col space-y-4 items-center">
      <span className="text-xl font-bold">로그인</span>
      <span className="text-sm">회원가입은 아래 버튼을 클릭해주세요.</span>
      <Link href="/sign-up/buyer">
        <Button variant={"outline"} className="text-xs">
          회원가입
        </Button>
      </Link>

      <Form {...logInForm}>
        <form
          onSubmit={logInForm.handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center space-y-2 w-[90%] max-w-[25rem] border border-1 rounded-md m-4 p-4"
        >
          <FormField
            control={logInForm.control}
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
            control={logInForm.control}
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
          <Button type="submit" disabled={false}>
            로그인
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default LogIn;
