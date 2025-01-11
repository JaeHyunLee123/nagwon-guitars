"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Instrument, Store } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { Button } from "./ui/Button";
interface InstrumentCardProps {
  store: Store;
  instrument: Instrument;
}

export default function InstrumentCard({
  store,
  instrument,
}: InstrumentCardProps) {
  return (
    <Card className="p-4 w-[16rem] h-[30rem]">
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

        <Link href={`/instrument/${instrument.id}`}>
          <Button variant={"outline"}>상세보기</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
