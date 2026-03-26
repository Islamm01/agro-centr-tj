// app/product/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AddToCartButton from "@/components/catalog/AddToCartButton";
import ProductInfo from "@/components/catalog/ProductInfo";
import { getProductBySlug } from "@/lib/actions/products";
import { getCartCount } from "@/lib/actions/cart";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const [product, cartCount] = await Promise.all([
    getProductBySlug(params.slug),
    getCartCount(),
  ]);
  if (!product) notFound();

  return (
    <>
      <Navbar cartCount={cartCount} />
      <main className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[12px] text-black/30 mb-10">
            <a href="/" className="hover:text-black transition-colors">Главная</a>
            <span>/</span>
            <a href="/catalog" className="hover:text-black transition-colors">Каталог</a>
            <span>/</span>
            <span className="text-black">{product.nameRu}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Image */}
            <div className="relative aspect-square bg-[#f0ede6] rounded-3xl overflow-hidden">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.nameRu} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[7rem]">🌿</div>
              )}
              {product.isOrganic && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/92 backdrop-blur-sm rounded-full">
                  <span className="text-[12px] font-bold text-[#1a472a]">🌿 Органическое</span>
                </div>
              )}
            </div>

            {/* Info */}
            <ProductInfo product={product} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
