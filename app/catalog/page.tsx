// app/catalog/page.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/catalog/ProductCard";
import CatalogHeader from "@/components/catalog/CatalogHeader";
import CatalogSidebar from "@/components/catalog/CatalogSidebar";
import { getProducts, getCategories } from "@/lib/actions/products";
import { getCartCount } from "@/lib/actions/cart";

export const revalidate = 60;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; page?: string };
}) {
  const page = Number(searchParams.page ?? 1);
  const [{ products, total, totalPages }, categories, cartCount] = await Promise.all([
    getProducts({ categorySlug: searchParams.category, search: searchParams.search, page }),
    getCategories(),
    getCartCount(),
  ]);

  return (
    <>
      <Navbar cartCount={cartCount} />
      <main className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <CatalogHeader
            total={total}
            activeCategory={categories.find((c: any) => c.slug === searchParams.category)}
          />
          <div className="flex gap-8">
            <CatalogSidebar
              categories={categories}
              activeSlug={searchParams.category}
            />
            <div className="flex-1 min-w-0">
              {/* Search */}
              <form className="mb-8">
                {searchParams.category && (
                  <input type="hidden" name="category" value={searchParams.category} />
                )}
                <input
                  type="search"
                  name="search"
                  defaultValue={searchParams.search}
                  placeholder="Поиск / Ҷустуҷӯ..."
                  className="w-full max-w-md px-4 py-3 border border-black/10 rounded-2xl text-[14px] bg-[#f7f5f0] focus:bg-white focus:border-black/25 focus:outline-none transition-colors"
                />
              </form>

              {/* Grid */}
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {products.map((p: any, i: number) => (
                      <ProductCard key={p.id} product={p} priority={i < 6} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-16">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <a
                          key={p}
                          href={`/catalog?${new URLSearchParams({
                            ...(searchParams.category ? { category: searchParams.category } : {}),
                            ...(searchParams.search ? { search: searchParams.search } : {}),
                            page: String(p),
                          })}`}
                          className={`w-10 h-10 flex items-center justify-center rounded-full text-[13px] font-bold transition-colors ${
                            p === page ? "bg-[#1a472a] text-white" : "text-black/40 hover:bg-black/5"
                          }`}
                        >
                          {p}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-24">
                  <div className="text-5xl mb-4 opacity-20">🌾</div>
                  <p className="text-[17px] font-semibold text-black/30">Продукты не найдены</p>
                  <p className="text-[13px] text-black/20 mt-1">Маҳсулот ёфт нашуд</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
