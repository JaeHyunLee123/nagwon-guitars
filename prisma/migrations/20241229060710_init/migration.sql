-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Buyer', 'Seller', 'Admin');

-- CreateEnum
CREATE TYPE "InstrumentType" AS ENUM ('Guitar', 'Bass');

-- CreateEnum
CREATE TYPE "GuitarFeature" AS ENUM ('Acoustic', 'Electric', 'Classic', 'SixString', 'SevenStringOrMore');

-- CreateEnum
CREATE TYPE "BassFeature" AS ENUM ('Acoustic', 'Electric', 'FourString', 'FiveString', 'SixStringOrMore');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "userPhoneNumber" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storePhoneNumber" TEXT NOT NULL,
    "webSite" TEXT,
    "address" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instrument" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageUrls" TEXT[],
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 1,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "specificationImageUrls" TEXT[],
    "specificationTexts" TEXT[],
    "type" "InstrumentType" NOT NULL,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "Instrument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guitar" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "features" "GuitarFeature"[],

    CONSTRAINT "Guitar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bass" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "features" "BassFeature"[],

    CONSTRAINT "Bass_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Store_userId_key" ON "Store"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Guitar_instrumentId_key" ON "Guitar"("instrumentId");

-- CreateIndex
CREATE UNIQUE INDEX "Bass_instrumentId_key" ON "Bass"("instrumentId");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instrument" ADD CONSTRAINT "Instrument_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guitar" ADD CONSTRAINT "Guitar_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bass" ADD CONSTRAINT "Bass_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
