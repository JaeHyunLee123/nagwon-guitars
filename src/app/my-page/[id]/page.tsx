import InstrumentCard from "@/components/InstrumentCard";
import PasswordDialog from "@/components/PasswordDialog";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { db } from "@/lib/db";
import getIronSessionData from "@/lib/session";
import { Instrument, Store } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

type storeWithInstrument = Store & { instruments: Instrument[] };

export default async function MyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getIronSessionData();
  const { id } = await params;

  if (!session.isLoggedIn) {
    redirect("/login");
  }

  if (session.userId !== id) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: { id },
  });

  let store: storeWithInstrument | null = null;

  if (user?.role === "Seller") {
    store = await db.store.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        instruments: true,
      },
    });
  }

  const sellingInstruments = store?.instruments;

  const likings = await db.userLikesInstrument.findMany({
    where: { userId: session.userId },
    include: {
      instrument: {
        include: {
          store: true,
        },
      },
    },
  });

  const likingInstruments = likings.map((liking) => liking.instrument);

  return (
    <div>
      <div className="flex flex-col items-center lg:flex-row lg:items-start">
        {user ? (
          <Card className="m-2 w-[30rem]">
            <CardHeader>
              <CardTitle>회원 정보</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <span>{`이름: ${user.name}`}</span>
              <span>{`이메일: ${user.email}`}</span>
              <span>{`전화번호: ${user.userPhoneNumber}`}</span>
              <PasswordDialog
                redirect={`/my-page/${user.id}/edit`}
                triggerText="회원 정보 수정"
              />
            </CardContent>
          </Card>
        ) : (
          <div>유저 정보가 없습니다.</div>
        )}

        {user?.role === "Seller" && store ? (
          <Card className="m-2 w-[30rem]">
            <CardHeader>
              <CardTitle>매장 정보</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <span>{`이름: ${store.storeName}`}</span>
              <span>{`전화번호: ${store.storePhoneNumber}`}</span>
              <span>{`주소: ${store.address}`}</span>
              <span>{`웹사이트: ${
                store.webSite || "등록된 웹사이트가 없습니다"
              }`}</span>
              <PasswordDialog
                redirect={`/my-page/${user.id}/edit/store`}
                triggerText="매장 정보 수정"
              />
            </CardContent>
          </Card>
        ) : (
          ""
        )}
      </div>
      {user?.role === "Seller" ? (
        <div className="flex flex-col space-y-2 p-2">
          <h1 className="text-lg font-extrabold">등록 악기</h1>
          <div className="grid gap-2 place-items-center m-2 w-full max-w-[1300px] p-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sellingInstruments && store && sellingInstruments.length > 0
              ? sellingInstruments.map((instrument) => (
                  <InstrumentCard
                    key={instrument.id}
                    instrument={instrument}
                    store={store}
                  />
                ))
              : "아직 등록한 악기가 없습니다."}
          </div>
          <Link href={"/instrument/register"}>
            <Button>악기 등록하기</Button>
          </Link>
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-col space-y-2 p-2">
        <h1 className="text-lg font-extrabold">관심 악기</h1>
        <div className="grid gap-2 place-items-center m-2 w-full max-w-[1300px] p-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {likingInstruments && likingInstruments.length > 0
            ? likingInstruments.map((likingInstrument) => (
                <InstrumentCard
                  key={likingInstrument.id}
                  instrument={likingInstrument}
                  store={likingInstrument.store}
                />
              ))
            : "관심 상품이 없습니다."}
        </div>
      </div>
    </div>
  );
}
