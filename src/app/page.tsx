import InstrumentCard from "@/components/InstrumentCard";
import { db } from "@/lib/db";

export default async function Home() {
  const instruments = await db.instrument.findMany({
    include: { store: true },
    take: 5,
  });

  return (
    <main className="flex justify-center align-middle">
      <div className="flex flex-wrap space-x-2 space-y-2 m-2 w-full">
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
