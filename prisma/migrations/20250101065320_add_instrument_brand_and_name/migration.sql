/*
  Warnings:

  - Added the required column `brand` to the `Instrument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Instrument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Instrument" ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
