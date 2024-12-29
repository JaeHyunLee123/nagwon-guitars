"use client";

import { useState } from "react";
import { Button } from "./ui/Button";

const Header = () => {
  const [isLoggedIn] = useState(false);

  return (
    <header className="flex justify-between py-4 px-2 border-b">
      <span className="font-bold text-2xl">낙원기타</span>
      {isLoggedIn ? <Button>마이 페이지</Button> : <Button>회원가입</Button>}
    </header>
  );
};

export default Header;
