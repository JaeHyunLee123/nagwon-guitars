"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import Link from "next/link";

const Header = () => {
  const [isLoggedIn] = useState(false);

  return (
    <header className="flex justify-between py-4 px-2 border-b">
      <Link href={"/"}>
        <span className="font-bold text-2xl">낙원기타</span>
      </Link>

      {isLoggedIn ? (
        <Button>마이 페이지</Button>
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
