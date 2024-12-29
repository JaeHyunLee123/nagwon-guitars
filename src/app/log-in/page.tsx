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

const logInFormSchema = z.object({
  email: z.string().email("이메일 포맷에 맞게 작성해주세요."),
  password: z.string().min(10, "비밀번호는 최소 10글자 이상이여야 합니다."),
});

const LogIn = () => {
  const logInForm = useForm<z.infer<typeof logInFormSchema>>({
    resolver: zodResolver(logInFormSchema),
    mode: "onChange",
  });

  const route = useRouter();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ email, password }: z.infer<typeof logInFormSchema>) => {
      return axios.get("/api/log-in", { params: { email, password } });
    },
    onSuccess: () => {
      route.push("/");
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
            title: "등록되지 않은 이메일입니다.",
            description: "등록한 이메일을 제출해주세요.",
            variant: "destructive",
          });
        } else if (error.response?.status === 500) {
          toast({
            title: "예상치 못한 서버 에러입니다.",
            description: "잠시 후 다시 요청해주세요.",
            variant: "destructive",
          });
        } else if (error.response?.status === 403) {
          toast({
            title: "비밀번호가 틀렸습니다.",
            description: "다시 입력해주세요.",
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

  const onSubmit = (form: z.infer<typeof logInFormSchema>) => {
    mutate(form);
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
          <Button type="submit" disabled={isPending}>
            로그인
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default LogIn;
