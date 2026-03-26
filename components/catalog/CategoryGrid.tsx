// components/catalog/CategoryGrid.tsx
"use client";
import Link from "next/link";
import { useLang } from "@/components/providers/LangProvider";
import { translations as T } from "@/lib/i18n";

const CAT_EMOJI: Record<string, string> = {
  "fruits": "🍎", "vegetables": "🥦", "dried-fruits": "🍇",
  "nuts": "🌰", "herbs": "🌿", "grains": "🌾", "default": "🌱",
};

export default function CategoryGrid({ categories }: { categories: any[] }) {
  const { lang } = useLang();
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/25 mb-2">
          {lang === "ru" ? "Разделы" : "Бахшҳо"}
        </p>
        <h2 className="text-[32px] font-black text-black tracking-tight">
          {lang === "ru" ? "Категории" : "Категорияҳо"}
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/catalog?category=${cat.slug}`}
            className="group bg-[#f7f5f0] hover:bg-[#1a472a] rounded-2xl p-5 aspect-square flex flex-col justify-between transition-all duration-300 hover:shadow-[0_8px_32px_rgba(26,71,42,0.2)]"
          >
            <span className="text-3xl">{CAT_EMOJI[cat.slug] ?? CAT_EMOJI.default}</span>
            <div>
              <p className="text-[14px] font-bold text-black group-hover:text-white transition-colors leading-tight">
                {lang === "ru" ? cat.nameRu : cat.nameTj}
              </p>
              <p className="text-[11px] text-black/35 group-hover:text-white/45 transition-colors mt-0.5">
                {cat._count?.products ?? 0} {T.catalog.products_count[lang]}
              </p>
            </div>
          </Link>
        ))}
        <Link href="/catalog" className="group bg-[#1a472a] rounded-2xl p-5 aspect-square flex flex-col justify-between">
          <span className="text-3xl text-white/20">→</span>
          <div>
            <p className="text-[14px] font-bold text-white leading-tight">
              {T.catalog.all_products[lang]}
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
