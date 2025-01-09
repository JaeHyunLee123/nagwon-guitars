import InstrumentCard from "@/components/InstrumentCard";
import { db } from "@/lib/db";

export default async function Home() {
  const instruments = await db.instrument.findMany({
    include: { store: true },
    take: 5,
  });

  return (
    <main className="flex justify-center itmem-center">
      <div className="grid gap-2 place-items-center m-2 w-full max-w-[1300px] p-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {instruments ? (
          instruments.map((instrument) => (
            <InstrumentCard
              key={instrument.id}
              instrument={instrument}
              store={instrument.store}
            />
          ))
        ) : (
          <div>로딩 중 </div>
        )}
      </div>
    </main>
  );
}
