import PasswordDialog from "@/components/PasswordDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { db } from "@/lib/db";
import getIronSessionData from "@/lib/session";
import { redirect } from "next/navigation";

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

  return (
    <div>
      {user ? (
        <Card className="m-2 w-[30rem]">
          <CardHeader>
            <CardTitle>회원 정보</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <span>{`이름: ${user.name}`}</span>
            <span>{`이메일: ${user.email}`}</span>
            <span>{`전화번호: ${user.userPhoneNumber}`}</span>
            <PasswordDialog />
          </CardContent>
        </Card>
      ) : (
        <div>유저 정보가 없습니다.</div>
      )}
    </div>
  );
}
