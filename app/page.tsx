// app/page.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/layout/HeroSection";
import WholesaleSection from "@/components/layout/WholesaleSection";
import ProductCard from "@/components/catalog/ProductCard";
import CategoryGridServer from "@/components/catalog/CategoryGridServer";
import { getFeaturedProducts } from "@/lib/actions/products";
import { getCartCount } from "@/lib/actions/cart";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, cartCount] = await Promise.all([
    getFeaturedProducts(),
    getCartCount(),
  ]);

  return (
    <>
      <Navbar cartCount={cartCount} />
      <main>
        <HeroSection />

        {/* Featured products */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <FeaturedHeader />
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 3} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-black/25">
              <p className="text-[16px]">Продукты скоро появятся</p>
            </div>
          )}
        </section>

        <CategoryGridServer />

        {/* Logistics banner */}
        <LogisticsBanner />

        <WholesaleSection />

        {/* CTA */}
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}

// These sub-components use "use client" for lang switching
import FeaturedHeader from "@/components/layout/FeaturedHeader";
import LogisticsBanner from "@/components/layout/LogisticsBanner";
import CtaSection from "@/components/layout/CtaSection";
