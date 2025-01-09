"use client";

import { Instrument, Store } from "@prisma/client";
import { useEffect, useState } from "react";
import InstrumentCard from "./InstrumentCard";
import { Button } from "./ui/Button";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";

type InstrumentWithStore = Instrument & { store: Store };

interface InstrumentGalleryProps {
  initialInstruments: InstrumentWithStore[];
}

interface QueryResult {
  instruments: InstrumentWithStore[];
  messege?: string;
}

export default function InstrumentGallery({
  initialInstruments,
}: InstrumentGalleryProps) {
  const [instruments, setInstruments] = useState<InstrumentWithStore[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAll, setIsAll] = useState(false);

  const { isFetching, data, refetch } = useQuery<QueryResult>({
    queryKey: ["instruments", currentPage],
    queryFn: async () => {
      const res = await axios.get(`/api/instrument`, {
        params: { page: currentPage },
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
    initialData: { instruments: initialInstruments },
    enabled: false,
  });

  useEffect(() => {
    if (data) {
      console.log(data.instruments);
      setInstruments(data.instruments);

      if (data.instruments.length < 5) {
        setIsAll(true);
      }
    }
  }, [data]);

  return (
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
      <Button
        onClick={() => {
          setCurrentPage((prev) => prev + 1);
          refetch();
        }}
        disabled={isFetching || isAll}
      >
        더 보기
      </Button>
    </div>
  );
}
