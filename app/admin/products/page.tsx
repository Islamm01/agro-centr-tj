// app/admin/products/page.tsx
import prisma from "@/lib/prisma";
import { formatTJS } from "@/lib/i18n";
import Link from "next/link";
import AdminProductRow from "@/components/admin/AdminProductRow";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({ searchParams }: { searchParams: { search?: string; page?: string } }) {
  const page = Number(searchParams.page ?? 1);
  const limit = 15;
  const where: any = {};
  if (searchParams.search) {
    where.OR = [
      { nameRu: { contains: searchParams.search, mode: "insensitive" } },
      { originRegion: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where, include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit, take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[26px] font-black text-black">Товары</h1>
          <p className="text-[13px] text-black/35 mt-0.5">{total} продуктов</p>
        </div>
        <Link href="/admin/products/new" className="px-5 py-2.5 bg-[#1a472a] text-white text-[13px] font-black rounded-full hover:bg-[#0d2e1a] transition-colors">
          + Добавить товар
        </Link>
      </div>

      <form className="mb-5">
        <input name="search" defaultValue={searchParams.search} placeholder="Поиск по названию, региону..."
          className="px-4 py-2.5 border border-black/10 rounded-xl text-[13px] bg-white focus:outline-none focus:border-[#1a472a]/40 w-full max-w-sm" />
      </form>

      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/5">
              {["Название (RU)", "Категория", "Нарх/кг", "Склад", "Статус", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-black/25">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/4">
            {products.map((p) => (
              <AdminProductRow key={p.id} product={p} />
            ))}
          </tbody>
        </table>
        {!products.length && <div className="py-16 text-center text-[13px] text-black/25">Продукты не найдены</div>}
      </div>
    </div>
  );
}
