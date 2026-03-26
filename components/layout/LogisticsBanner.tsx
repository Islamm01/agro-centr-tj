// components/layout/LogisticsBanner.tsx
"use client";
import { useLang } from "@/components/providers/LangProvider";
import { translations as T } from "@/lib/i18n";
export default function LogisticsBanner() {
  const { lang } = useLang();
  const L = T.logistics;
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-[#f0ede6] rounded-3xl p-10 md:p-14 relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/30 mb-4">
            {lang === "ru" ? "Логистика" : "Логистика"}
          </p>
          <h2 className="text-[30px] font-black text-black tracking-tight mb-4 leading-tight">
            {L.title[lang]}
          </h2>
          <p className="text-[14px] text-black/50 leading-relaxed mb-6">{L.subtitle[lang]}</p>
          <div className="flex flex-wrap gap-2">
            {(lang === "ru"
              ? ["Самовывоз", "Местная доставка", "Малый грузовик", "Большой грузовик", "Договорная"]
              : ["Худ гирифтан", "Расонидани маҳаллӣ", "Мошини хурд", "Мошини калон", "Тавофуқӣ"]
            ).map((m) => (
              <span key={m} className="px-3 py-1.5 bg-white rounded-full text-[12px] font-semibold text-black border border-black/6 shadow-sm">
                {m}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute right-8 bottom-4 text-[7rem] opacity-8 select-none pointer-events-none">🚚</div>
      </div>
    </section>
  );
}
