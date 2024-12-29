import { Card, CardContent, CardTitle } from "@/components/ui/Card";

export default function Home() {
  return (
    <main className="flex justify-center align-middle">
      <div className="flex flex-wrap space-x-2 space-y-2 m-2 w-full">
        {[1, 2, 3, 4, 5].map((num) => (
          <Card key={num} className="p-4">
            <CardTitle>나는 일렉 기타다</CardTitle>
            <CardContent className="flex flex-col mt-5 space-y-2">
              <div className="border border-1 w-20 h-20">기타 이미지</div>
              <span>Fender</span>
              <span>Fender telecaster</span>
              <span>2,200,000원</span>
              <span>판매 상점: 제일 기타</span>
              <span>재고: 1</span>
              <span>중고</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
