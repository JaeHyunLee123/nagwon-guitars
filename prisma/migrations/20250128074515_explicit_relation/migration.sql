/*
  Warnings:

  - You are about to drop the `_UserLikesInstrument` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserLikesInstrument" DROP CONSTRAINT "_UserLikesInstrument_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserLikesInstrument" DROP CONSTRAINT "_UserLikesInstrument_B_fkey";

-- DropTable
DROP TABLE "_UserLikesInstrument";

-- CreateTable
CREATE TABLE "UserLikesInstrument" (
    "userId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLikesInstrument_pkey" PRIMARY KEY ("userId","instrumentId")
);

-- AddForeignKey
ALTER TABLE "UserLikesInstrument" ADD CONSTRAINT "UserLikesInstrument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikesInstrument" ADD CONSTRAINT "UserLikesInstrument_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
