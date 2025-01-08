import { PrismaClient, Store } from "@prisma/client";
const db = new PrismaClient();

const sellerNames = ["김철수", "이영희", "오해원", "신짱구", "릴리"];
const storeNames = [
  "철수 상가",
  "영희 기타",
  "해원달원",
  "짱구는 못말려",
  "릴리의 기타베이스",
];

const instrumentNames = [
  "펜더 재즈 베이스",
  "펜더 프리시전 베이스",
  "펜더 스트타로캐스터",
  "펜더 텔레캐스터",
  "깁슨 플라잉V",
  "깁슨 레스폴",
  "뮤직맨 조다트 베이스",
  "리켄베커 4003 베이스",
];

const instrumentImages = [
  "fender-jazzbass.jpg",
  "fender-precisionbass.jpg",
  "fender-stratocaster.jpg",
  "fender-telecaster.jpg",
  "gibson-flyingV.jpg",
  "gibson-lespol.png",
  "musicman-joedart.jpg",
  "rickenbacker-4003.jpg",
];

const instrumentPrices = [
  2_000_000, 2_500_000, 2_800_000, 2_500_000, 3_200_000, 3_200_000, 2_500_000,
  4200000,
];

async function main() {
  const stores = await db.store.findMany({
    where: {
      storePhoneNumber: {
        equals: "02-1234-5678", //this is the storePhoneNumber of the test sellers
      },
    },
  });

  // store에 instrument 생성
  instrumentNames.forEach(async (name, i) => {
    await db.instrument.create({
      data: {
        name: name,
        price: instrumentPrices[i],
        storeId: stores[i % stores.length].id,
        instrumentImage: instrumentImages[i],
        brand: `${name.split(" ")[0]}`,
        type: name.includes("베이스") ? "Bass" : "Guitar",
      },
    });
  });
}

const createSeller = async () => {
  // seller 생성
  sellerNames.forEach(async (name, i) => {
    const user = await db.user.create({
      data: {
        name,
        email: `seller${i}@email.com`,
        password: "0123456789",
        role: "Seller",
        isApproved: true,
        userPhoneNumber: "010-1234-5678",
      },
    });

    await db.store.create({
      data: {
        storeName: storeNames[i],
        address: `20${i}호`,
        storePhoneNumber: "02-1234-5678",
        userId: user.id,
      },
    });
  });
};

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
