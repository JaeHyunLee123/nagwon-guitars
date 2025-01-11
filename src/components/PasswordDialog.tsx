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
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  password: z.string().min(10, "비밀번호는 최소 10글자 이상이여야 합니다."),
});

export default function PasswordDialog() {
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
