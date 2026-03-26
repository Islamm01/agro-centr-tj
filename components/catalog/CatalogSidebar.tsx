// components/catalog/CatalogSidebar.tsx
"use client";
import Link from "next/link";
import { useLang } from "@/components/providers/LangProvider";
import { translations as T } from "@/lib/i18n";
export default function CatalogSidebar({ categories, activeSlug }: { categories: any[]; activeSlug?: string }) {
  const { lang } = useLang();
  return (
    <aside className="hidden lg:block w-52 shrink-0">
      <div className="sticky top-24 space-y-0.5">
        <Link
          href="/catalog"
          className={`block px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors ${
            !activeSlug ? "bg-[#1a472a] text-white" : "text-black/50 hover:text-black hover:bg-black/4"
          }`}
        >
          {T.catalog.all_products[lang]}
        </Link>
        {categories.map((cat: any) => (
          <Link
            key={cat.id}
            href={`/catalog?category=${cat.slug}`}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors ${
              activeSlug === cat.slug ? "bg-[#1a472a] text-white" : "text-black/50 hover:text-black hover:bg-black/4"
            }`}
          >
            <span>{lang === "ru" ? cat.nameRu : cat.nameTj}</span>
            <span className="text-[11px] opacity-40">{cat._count?.products}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
