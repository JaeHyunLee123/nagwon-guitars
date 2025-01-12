"use client";

import { useForm } from "react-hook-form";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/Dialog";
import { Input } from "./ui/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { SessionData } from "@/lib/session";

const formSchema = z.object({
  password: z.string().min(10, "비밀번호는 최소 10글자 이상이여야 합니다."),
});

interface PasswordDialogProps {
  session: SessionData;
}

export default function PasswordDialog({ session }: PasswordDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const route = useRouter();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ password }: z.infer<typeof formSchema>) => {
      return axios.get("/api/check-password", { params: { password } });
    },
    onSuccess: () => {
      toast({
        title: "비밀번호가 확인되었습니다.",
        variant: "success",
      });

      route.push(`/my-page/${session.userId}/edit`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast({
            title: "비밀번호를 전송해주세요.",
            variant: "destructive",
          });
        } else if (error.response?.status === 401) {
          toast({
            title: "로그인 후 시도해주세요.",
            variant: "destructive",
          });
        } else if (error.response?.status === 404) {
          toast({
            title: "올바르지 않은 계정입니다.",
            variant: "destructive",
          });
        } else if (error.response?.status === 403) {
          toast({
            title: "비밀번호가 올바르지 않습니다.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "알 수 없는 서버 에러가 발생했습니다.",
          description: "잠시 후 다시 시도해주세요.",
          variant: "destructive",
        });
      }
    },
  });

  const onSubmit = (formData: z.infer<typeof formSchema>) => {
    mutate(formData);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>회원 정보 수정</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          회원 정보를 수정하려면 비밀번호를 입력해주세요.
        </DialogTitle>
        <Form {...form}>
          <form
            className="flex flex-col space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit" disabled={isPending}>
                확인
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
