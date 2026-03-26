// app/cart/page.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartPageClient from "@/components/cart/CartPageClient";
import { getCart, getCartCount } from "@/lib/actions/cart";

export default async function CartPage() {
  const [items, cartCount] = await Promise.all([getCart(), getCartCount()]);
  return (
    <>
      <Navbar cartCount={cartCount} />
      <main className="min-h-screen pt-20">
        <CartPageClient items={items} />
      </main>
      <Footer />
    </>
  );
}
