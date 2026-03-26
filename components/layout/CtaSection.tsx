// components/layout/CtaSection.tsx
"use client";
import Link from "next/link";
import { useLang } from "@/components/providers/LangProvider";
export default function CtaSection() {
  const { lang } = useLang();
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 text-center">
      <h2 className="text-[clamp(1.8rem,5vw,3.5rem)] font-black text-black tracking-tight mb-4">
        {lang === "ru" ? "Готовы начать?" : "Оғоз кардан тайёр?"}
      </h2>
      <p className="text-[15px] text-black/45 mb-8 max-w-sm mx-auto">
        {lang === "ru"
          ? "Присоединяйтесь к тысячам покупателей Таджикистана"
          : "Ба ҳазорҳо харидорони Тоҷикистон ҳамроҳ шавед"}
      </p>
      <div className="flex justify-center gap-3">
        <Link href="/catalog" className="px-7 py-3.5 bg-[#1a472a] text-white text-[14px] font-bold rounded-full hover:bg-[#0d2e1a] transition-colors shadow-[0_4px_20px_rgba(26,71,42,0.25)]">
          {lang === "ru" ? "Смотреть каталог" : "Каталогро бинед"}
        </Link>
        <a href="mailto:info@agrocentr.tj" className="px-7 py-3.5 border border-black/12 text-black text-[14px] font-semibold rounded-full hover:bg-black/4 transition-colors">
          {lang === "ru" ? "Связаться" : "Тамос гирифтан"}
        </a>
      </div>
    </section>
  );
}
