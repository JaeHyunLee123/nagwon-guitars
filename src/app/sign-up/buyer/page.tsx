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
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const signupFormSchema = z
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

const SignUp = () => {
  const signUpForm = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    mode: "onChange",
  });

  const onSubmit = (form: z.infer<typeof signupFormSchema>) => {
    mutate(form);
  };

  const route = useRouter();

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      email,
      password,
      name,
      phoneNumber,
    }: z.infer<typeof signupFormSchema>) => {
      return axios.post("/sign-up/buyer", {
        email,
        password,
        name,
        phoneNumber,
      });
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

  return (
    <main>
      <div className="w-full flex flex-col space-y-2 items-center">
        <span className="text-xl font-bold">회원가입</span>
        <span className="text-sm">
          판매자 회원 회원가입은 아래 버튼을 클릭해주세요.
        </span>
        <Link href="/sign-up/seller">
          <Button variant={"outline"} className="text-xs">
            판매자 회원가입
          </Button>
        </Link>
      </div>

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
            회원가입
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default SignUp;
