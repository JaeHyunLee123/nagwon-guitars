"use client";

import { User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Button } from "./ui/Button";

export default function NewSellerCard(newSellor: User) {
  return (
    <Card className="p-2 w-[40rem]">
      <CardHeader>
        <CardTitle>{`${newSellor.name}님`}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col space-y-2">
        <span>{`매장 이름:`}</span>
        <span>{`매장 번호: `}</span>
        <span>{`매장 위치:`}</span>
        <span>{`등록일자: ${newSellor.createdAt.getMonth()}월 ${newSellor.createdAt.getDate()}일`}</span>
      </CardContent>
      <CardFooter>
        <Button>등록 승인</Button>
      </CardFooter>
    </Card>
  );
}
