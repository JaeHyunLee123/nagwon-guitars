import NewSellerCard from "@/components/NewSellerCard";
import { db } from "@/lib/db";
import getIronSessionData from "@/lib/session";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Admin() {
  const session = await getIronSessionData();

  if (session.role !== "Admin") {
    redirect("/");
  }

  const newSellers = await db.user.findMany({
    where: {
      role: "Seller",
      isApproved: false,
    },
  });

  return (
    <div className="p-2">
      <div className="flex flex-col">
        <span className="text-2xl font-bold">
          승인 대기 중인 신규 판매자 목록
        </span>
        {!newSellers || newSellers.length === 0 ? (
          <span>승인 대기 중인 판매자가 없습니다</span>
        ) : (
          <div className="flex flex-col space-y-4">
            {newSellers.map((newSeller: User) => (
              <NewSellerCard key={newSeller.id} {...newSeller} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
