// app/checkout/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CheckoutClient from "@/components/cart/CheckoutClient";
import { getCart, getCartCount } from "@/lib/actions/cart";
import { authOptions } from "@/lib/auth";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/api/auth/signin?callbackUrl=/checkout");

  const [items, cartCount] = await Promise.all([getCart(), getCartCount()]);
  if (!items.length) redirect("/cart");

  return (
    <>
      <Navbar cartCount={cartCount} />
      <main className="min-h-screen pt-20">
        <CheckoutClient items={items} user={session.user} />
      </main>
      <Footer />
    </>
  );
}
