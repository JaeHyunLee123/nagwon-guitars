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

const signupFormSchema = z
  .object({
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
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "비밀번호가 서로 같지 않습니다.",
    path: ["passwordConfirmation"], // Error will be associated with passwordConfirmation
  });

const SellorSignUp = () => {
  const signUpForm = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    mode: "onChange",
  });

  const onSubmit = (form: z.infer<typeof signupFormSchema>) => {
    console.log(form);
  };

  return (
    <main className="flex flex-col space-y-4 items-center">
      <span className="text-xl font-bold">판매자 회원가입</span>
      <span className="text-sm">
        일반 회원 회원가입은 아래 버튼을 클릭해주세요.
      </span>
      <Link href="/sign-up/buyer">
        <Button variant={"outline"} className="text-xs">
          일반 회원가입
        </Button>
      </Link>

      <Form {...signUpForm}>
        <form
          onSubmit={signUpForm.handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center space-y-2 w-[90%] max-w-[25rem] border border-1 rounded-md m-4 p-4"
        >
          <FormField
            control={signUpForm.control}
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
            control={signUpForm.control}
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
            control={signUpForm.control}
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
            control={signUpForm.control}
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
            control={signUpForm.control}
            name="userPhoneNumber"
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
          <FormField
            control={signUpForm.control}
            name="storePhoneNumber"
            render={({ field }) => (
              <FormItem className="w-[90%]">
                <FormLabel>가게 번호</FormLabel>
                <FormControl>
                  <Input {...field} type={"tel"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={signUpForm.control}
            name="storeAddress"
            render={({ field }) => (
              <FormItem className="w-[90%]">
                <FormLabel>가게 주소</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={signUpForm.control}
            name="storeWebsite"
            render={({ field }) => (
              <FormItem className="w-[90%]">
                <FormLabel>가게 웹사이트(있을 경우에만 작성)</FormLabel>
                <FormControl>
                  <Input {...field} type={"url"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={false}>
            회원가입
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default SellorSignUp;
