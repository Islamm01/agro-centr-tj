// app/orders/[number]/page.tsx
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderDetailClient from "@/components/cart/OrderDetailClient";
import { getOrderByNumber } from "@/lib/actions/orders";
import { getCartCount } from "@/lib/actions/cart";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: { number: string };
  searchParams: { new?: string };
}) {
  const [order, cartCount] = await Promise.all([
    getOrderByNumber(params.number),
    getCartCount(),
  ]);
  if (!order) notFound();

  return (
    <>
      <Navbar cartCount={cartCount} />
      <main className="min-h-screen pt-20">
        <OrderDetailClient order={order} isNew={searchParams.new === "1"} />
      </main>
      <Footer />
    </>
  );
}
