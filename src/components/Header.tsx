"use client";

import { useSession } from "@/hooks/useSession";
import { Button } from "./ui/Button";
import Link from "next/link";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Header = () => {
  const { data: session } = useSession();

  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: () => {
      return axios.post("/api/log-out");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });

  return (
    <header className="flex justify-between py-4 px-2 border-b">
      <Link href={"/"}>
        <span className="font-bold text-lg md:text-2xl">낙원기타</span>
      </Link>

      {session?.isLoggedIn ? (
        <div className="flex space-x-2 items-center">
          <span className="hidden md:block">{`안녕하세요, ${session.username}님`}</span>
          <Button
            variant={"outline"}
            onClick={() => {
              logout();
            }}
          >
            로그아웃
          </Button>
          <Link href={`/my-page/${session.userId}`}>
            <Button>마이 페이지</Button>
          </Link>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Link href={"/log-in"}>
            <Button variant={"outline"}>로그인</Button>
          </Link>
          <Link href={"/sign-up/buyer"}>
            <Button>회원가입</Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
