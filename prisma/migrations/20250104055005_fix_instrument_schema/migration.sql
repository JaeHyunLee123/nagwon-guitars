/*
  Warnings:

  - You are about to drop the column `imageUrls` on the `Instrument` table. All the data in the column will be lost.
  - You are about to drop the column `specificationImageUrls` on the `Instrument` table. All the data in the column will be lost.
  - You are about to drop the column `specificationTexts` on the `Instrument` table. All the data in the column will be lost.
  - You are about to drop the `Bass` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Guitar` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageUrl` to the `Instrument` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bass" DROP CONSTRAINT "Bass_instrumentId_fkey";

-- DropForeignKey
ALTER TABLE "Guitar" DROP CONSTRAINT "Guitar_instrumentId_fkey";

-- AlterTable
ALTER TABLE "Instrument" DROP COLUMN "imageUrls",
DROP COLUMN "specificationImageUrls",
DROP COLUMN "specificationTexts",
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "specificationImageUrl" TEXT,
ADD COLUMN     "specificationText" TEXT;

-- DropTable
DROP TABLE "Bass";

-- DropTable
DROP TABLE "Guitar";

-- DropEnum
DROP TYPE "BassFeature";

-- DropEnum
DROP TYPE "GuitarFeature";
