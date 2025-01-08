import InstrumentCard from "@/components/InstrumentCard";
import { db } from "@/lib/db";

export default async function Home() {
  const instruments = await db.instrument.findUnique({
    where: { id: "cm5npbg8a00014p60v6v1it0o" },
    include: { store: true },
  });

  return (
    <main className="flex justify-center align-middle">
      <div className="flex flex-wrap space-x-2 space-y-2 m-2 w-full">
        {instruments ? (
          <InstrumentCard instrument={instruments} store={instruments.store} />
        ) : (
          <div>로딩 중 </div>
        )}
      </div>
    </main>
  );
}
