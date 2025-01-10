"use client";

import { Instrument, Store } from "@prisma/client";
import { useEffect, useState } from "react";
import InstrumentCard from "./InstrumentCard";
import { Button } from "./ui/Button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type InstrumentWithStore = Instrument & { store: Store };

interface InstrumentGalleryProps {
  initialInstruments: InstrumentWithStore[];
}

export default function InstrumentGallery({
  initialInstruments,
}: InstrumentGalleryProps) {
  const [instruments, setInstruments] =
    useState<InstrumentWithStore[]>(initialInstruments);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAll, setIsAll] = useState(false);

  const { data, refetch, isFetching } = useQuery<InstrumentWithStore[]>({
    queryKey: ["instruments"],
    queryFn: async () => {
      const res = await axios.get(`/api/instrument`, {
        params: { page: currentPage },
      });
      return res.data;
    },
    enabled: false,
  });

  useEffect(() => {
    if (data) {
      console.log(data);

      if (data.length < 5) {
        setIsAll(true);
      }

      if (currentPage === 0) {
        setInstruments(data);
      } else {
        setInstruments((prev) => [...prev, ...data]);
      }
    }
  }, [data, currentPage]);

  useEffect(() => {
    console.log("instruments", instruments);
  }, [instruments]);

  const handleLoadMore = () => {
    if (!isFetching) {
      setCurrentPage((prev) => prev + 1);
      refetch();
    }
  };
  return (
    <div className="grid gap-2 place-items-center m-2 w-full max-w-[1300px] p-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {instruments.map((instrument) => (
        <InstrumentCard
          key={instrument.id}
          instrument={instrument}
          store={instrument.store}
        />
      ))}
      {isAll ? (
        <div>더 이상 불러올 상품이 없습니다.</div>
      ) : (
        <Button onClick={handleLoadMore} disabled={isFetching || isAll}>
          더 보기
        </Button>
      )}
    </div>
  );
}
