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
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    storeName: z.string(),
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

  const route = useRouter();

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: (form: z.infer<typeof signupFormSchema>) => {
      return axios.post("/api/sign-up/sellor", form);
    },
    onSuccess: () => {
      toast({
        title: "계정을 생성했습니다.",
        variant: "success",
      });
      route.push("/log-in");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        //invalid form
        if (error.response?.status === 422) {
          toast({
            title: "유효하지 않은 입력입니다.",
            description: "양식에 맞게 입력해주시길 바랍니다.",
            variant: "destructive",
          });
          //이미 사용중인 이메일
        } else if (error.response?.status === 409) {
          toast({
            title: "이미 사용중인 이메일입니다.",
            description: "다른 이메일을 제출해주세요.",
            variant: "destructive",
          });
        } else if (error.response?.status === 500) {
          toast({
            title: "예상치 못한 서버 에러입니다.",
            description: "잠시 후 다시 요청해주세요.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "알 수 없는 에러가 발생했습니다.",
            description: "잠시 후 다시 요청해주세요.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "알 수 없는 에러가 발생했습니다.",
          description: "잠시 후 다시 요청해주세요.",
          variant: "destructive",
        });
      }
    },
  });

  const onSubmit = (form: z.infer<typeof signupFormSchema>) => {
    mutate(form);
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
            name="storeName"
            render={({ field }) => (
              <FormItem className="w-[90%]">
                <FormLabel>가게 이름</FormLabel>
                <FormControl>
                  <Input {...field} />
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
          <Button type="submit" disabled={isPending}>
            회원가입
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default SellorSignUp;
