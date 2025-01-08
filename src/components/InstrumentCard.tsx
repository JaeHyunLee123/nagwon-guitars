"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Instrument, Store } from "@prisma/client";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
interface InstrumentCardProps {
  store: Store;
  instrument: Instrument;
}

export default function InstrumentCard({
  store,
  instrument,
}: InstrumentCardProps) {
  const getImageUrl = (instrumentImage: string) => {
    const result = supabase.storage
      .from("instrument-image")
      .getPublicUrl(instrumentImage, {
        transform: { width: 100, height: 100 },
      });

    return result.data.publicUrl;
  };

  return (
    <Card className="p-4">
      <CardContent className="flex flex-col mt-5 space-y-2">
        {/*TODO: solve image error! */}
        <Image
          src={getImageUrl(instrument.instrumentImage)}
          className="border border-1 w-20 h-20"
          alt={"instrument-image"}
          width={80}
          height={80}
        />

        <span>{`${instrument.brand}`}</span>
        <span>{`${instrument.name}`}</span>
        <span>{`${instrument.price.toLocaleString()}원`}</span>
        <span>{`구분: ${instrument.type}`}</span>
        <span>{`판매 상점: ${store.storeName}`}</span>
        <span>{`재고: ${instrument.stock}`}</span>
        <span>{instrument.isUsed ? "중고" : "신품"}</span>
      </CardContent>
    </Card>
  );
}
