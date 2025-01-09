import InstrumentGallery from "@/components/InstrumentGallery";
import { db } from "@/lib/db";

export default async function Home() {
  const instruments = await db.instrument.findMany({
    include: { store: true },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex justify-center itmem-center">
      <InstrumentGallery initialInstruments={instruments} />
    </main>
  );
}
