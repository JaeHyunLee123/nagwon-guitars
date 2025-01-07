/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Instrument` table. All the data in the column will be lost.
  - You are about to drop the column `specificationImageUrl` on the `Instrument` table. All the data in the column will be lost.
  - Added the required column `instrumentImage` to the `Instrument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Instrument" DROP COLUMN "imageUrl",
DROP COLUMN "specificationImageUrl",
ADD COLUMN     "instrumentImage" TEXT NOT NULL,
ADD COLUMN     "specificationImage" TEXT;
