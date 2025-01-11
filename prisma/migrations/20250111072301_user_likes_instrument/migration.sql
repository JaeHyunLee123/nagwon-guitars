-- CreateTable
CREATE TABLE "_UserLikesInstrument" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserLikesInstrument_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserLikesInstrument_B_index" ON "_UserLikesInstrument"("B");

-- AddForeignKey
ALTER TABLE "_UserLikesInstrument" ADD CONSTRAINT "_UserLikesInstrument_A_fkey" FOREIGN KEY ("A") REFERENCES "Instrument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikesInstrument" ADD CONSTRAINT "_UserLikesInstrument_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
