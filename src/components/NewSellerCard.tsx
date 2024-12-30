"use client";

import { Store, User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Button } from "./ui/Button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function NewSellerCard(newSellor: User) {
  const fetchStore = async () => {
    const response = await axios.get("/api/store", {
      params: { sellerId: newSellor.id },
    });
    return response.data;
  };
  const { data: store, isPending } = useQuery<Store>({
    queryKey: ["store", `${newSellor.id}`],
    queryFn: fetchStore,
  });

  return (
    <Card className="p-2 w-[90%] max-w-[25rem]">
      <CardHeader>
        <CardTitle>{`${newSellor.name}님`}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col space-y-2">
        {isPending ? (
          <div>매장 정보 로딩중</div>
        ) : (
          <>
            <span>{`매장 이름: ${store?.storeName}`}</span>
            <span>{`매장 번호: ${store?.storePhoneNumber}`}</span>
            <span>{`매장 위치:${store?.address}`}</span>
            <span>{`매장 url: ${
              store?.webSite ? store.webSite : "없음"
            }`}</span>
          </>
        )}

        <span>{`등록일자: ${newSellor.createdAt.getMonth()}월 ${newSellor.createdAt.getDate()}일`}</span>
      </CardContent>
      <CardFooter>
        <Button>등록 승인</Button>
      </CardFooter>
    </Card>
  );
}
