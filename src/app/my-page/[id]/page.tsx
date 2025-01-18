import InstrumentCard from "@/components/InstrumentCard";
import PasswordDialog from "@/components/PasswordDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { db } from "@/lib/db";
import getIronSessionData from "@/lib/session";
import { Instrument, Store } from "@prisma/client";
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

  const instruments = store?.instruments;

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
      <div className="flex flex-col space-y-2 p-2">
        <h1 className="text-lg font-extrabold">등록 악기</h1>
        <div className="grid gap-2 place-items-center m-2 w-full max-w-[1300px] p-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {instruments && store
            ? instruments.map((instrument) => (
                <InstrumentCard
                  key={instrument.id}
                  instrument={instrument}
                  store={store}
                />
              ))
            : ""}
        </div>
      </div>
    </div>
  );
}
