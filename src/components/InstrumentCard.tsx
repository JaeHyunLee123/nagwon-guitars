"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Instrument, Store } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { Button } from "./ui/Button";
import Heart from "./Heart";
import { useSession } from "@/hooks/useSession";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
interface InstrumentCardProps {
  store: Store;
  instrument: Instrument;
}

export default function InstrumentCard({
  store,
  instrument,
}: InstrumentCardProps) {
  const session = useSession();

  const onLikeClick = () => {
    console.log("hi");
  };

  return (
    <Card className="p-4 w-[18rem] h-[30rem]">
      <CardContent className="flex flex-col space-y-2">
        <CardTitle>
          <span>{`${instrument.name}`}</span>
        </CardTitle>
        <div className="relative w-40 h-40">
          <Image
            src={getImageUrl(instrument.instrumentImage)}
            className="border border-1 "
            alt={"instrument-image"}
            fill={true}
            objectFit="contain"
          />
        </div>

        <span>{`${instrument.brand}`}</span>
        <span>{`${instrument.name}`}</span>
        <span>{`${instrument.price.toLocaleString()}원`}</span>
        <span>{`구분: ${instrument.type}`}</span>
        <span>{`판매 상점: ${store.storeName}`}</span>
        <span>{`재고: ${instrument.stock}`}</span>
        <span>{instrument.isUsed ? "중고" : "신품"}</span>

        <div className="flex space-x-2 items-center">
          <Link href={`/instrument/${instrument.id}`}>
            <Button variant={"outline"}>상세보기</Button>
          </Link>
          {session.data?.isLoggedIn ? (
            <Heart
              isRed={false}
              className="text-red-500 hover:cursor-pointer"
              onClick={onLikeClick}
            />
          ) : (
            <Dialog>
              <DialogTrigger>
                <Heart
                  isRed={false}
                  className="text-red-500 hover:cursor-pointer"
                />
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>
                  관심상품에 등록하기 위해서 로그인 해주세요.
                </DialogTitle>
                <DialogDescription>
                  로그인 혹은 회원가입을 원하시면 아래 버튼을 클릭해주세요.
                </DialogDescription>
                <div className="flex space-x-2 items-center justify-center">
                  <DialogClose>
                    <Button variant={"destructive"}>취소</Button>
                  </DialogClose>
                  <Link href={"/log-in"}>
                    <Button variant={"outline"}>로그인</Button>
                  </Link>
                  <Link href={"/sign-up/buyer"}>
                    <Button variant={"default"}>회원가입</Button>
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
