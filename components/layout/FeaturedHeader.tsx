// components/layout/FeaturedHeader.tsx
"use client";
import Link from "next/link";
import { useLang } from "@/components/providers/LangProvider";
import { translations as T } from "@/lib/i18n";
export default function FeaturedHeader() {
  const { lang } = useLang();
  return (
    <div className="flex items-end justify-between mb-12">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/25 mb-2">
          {lang === "ru" ? "Популярное" : "Маъмул"}
        </p>
        <h2 className="text-[32px] font-black text-black tracking-tight">
          {lang === "ru" ? "Сезонные продукты" : "Маҳсулоти мавсимӣ"}
        </h2>
      </div>
      <Link href="/catalog" className="text-[13px] font-semibold text-[#1a472a] hover:underline">
        {T.catalog.view_all[lang]} →
      </Link>
    </div>
  );
}
