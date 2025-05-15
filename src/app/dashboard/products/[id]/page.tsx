
import { Button } from "@/components/ui/button";


interface ProductDetailProps {
  params: { id: string };
}

export default function ProductDetail({ params }: ProductDetailProps) {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Detail Page</h1>
      <Button className="bg-amber-300 text-black">This is button</Button>
      <p>{params.id}</p>
    </div>
  );
}
