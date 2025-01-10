import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { db } from "@/lib/db";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";

export default async function InstrumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const instrument = await db.instrument.findUnique({
    where: {
      id,
    },
    include: {
      store: true,
    },
  });

  if (!instrument) {
    return { status: 404 };
  }

  const store = instrument.store;

  return (
    <div className="p-2 flex flex-col items-center">
      <Card className="w-[80%] max-w-[75rem]">
        <CardHeader>
          <CardTitle className="text-xl">{instrument.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex lg:flex-row flex-col space-x-2 space-y-2">
          <div className="relative w-60 h-60">
            <Image
              src={getImageUrl(instrument.instrumentImage)}
              className="border border-1 "
              alt={"instrument-image"}
              fill={true}
              objectFit="contain"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-bold text-lg">악기 정보</span>
            <span>{`브랜드: ${instrument.brand}`}</span>
            <span>{`악기 이름: ${instrument.name}`}</span>
            <span>{`가격: ${instrument.price.toLocaleString()}원`}</span>
            <span>{`구분: ${instrument.type}`}</span>
            <span>{`재고: ${instrument.stock}`}</span>
            <span>{instrument.isUsed ? "중고" : "신품"}</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-bold text-lg">상점 정보</span>
            <span>{`판매 상점: ${store.storeName}`}</span>
            <span>{`주소: 낙원상가 ${store.address}`}</span>
            <span>{`전화번호: ${store.storePhoneNumber}`}</span>
            <span>{`웹사이트: ${
              store.webSite ? store.webSite : "등록된 웹사이트가 없습니다."
            }`}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
