// components/catalog/CatalogHeader.tsx
"use client";
import { useLang } from "@/components/providers/LangProvider";
import { translations as T } from "@/lib/i18n";
export default function CatalogHeader({ total, activeCategory }: { total: number; activeCategory?: any }) {
  const { lang } = useLang();
  return (
    <div className="mb-10">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/25 mb-1">
        {total} {T.catalog.products_count[lang]}
      </p>
      <h1 className="text-[38px] font-black text-black tracking-tight">
        {activeCategory
          ? (lang === "ru" ? activeCategory.nameRu : activeCategory.nameTj)
          : T.catalog.title[lang]}
      </h1>
    </div>
  );
}
