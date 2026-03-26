// components/layout/WholesaleSection.tsx
"use client";
import { useLang } from "@/components/providers/LangProvider";
import { translations as T } from "@/lib/i18n";

export default function WholesaleSection() {
  const { lang } = useLang();
  const W = T.wholesale;
  const tiers = T.tiers;

  const list = [
    { key: "retail" as const, discount: 0, highlight: false },
    { key: "wholesale" as const, discount: 12, highlight: true },
    { key: "bulk" as const, discount: 22, highlight: false },
    { key: "industrial" as const, discount: 30, highlight: false },
  ];

  return (
    <section id="wholesale" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-20">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a472a]/6 rounded-full border border-[#1a472a]/10 mb-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1a472a]">{W.badge[lang]}</span>
        </div>
        <h2 className="text-[38px] font-black text-black tracking-tight mb-3">{W.title[lang]}</h2>
        <p className="text-[15px] text-black/45 max-w-md mx-auto">{W.subtitle[lang]}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {list.map(({ key, discount, highlight }) => {
          const tier = tiers[key];
          return (
            <div
              key={key}
              className={`rounded-2xl p-6 transition-all duration-300 ${
                highlight
                  ? "bg-[#1a472a] text-white shadow-[0_8px_40px_rgba(26,71,42,0.25)]"
                  : "bg-[#f7f5f0] hover:bg-white hover:shadow-md border border-transparent hover:border-black/6"
              }`}
            >
              <div className="flex items-center justify-between mb-5">
                <span className={`text-[9px] font-bold uppercase tracking-[0.14em] ${highlight ? "text-white/40" : "text-black/25"}`}>
                  {key.toUpperCase()}
                </span>
                {discount > 0 && (
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${highlight ? "bg-white/12 text-white" : "bg-[#1a472a]/8 text-[#1a472a]"}`}>
                    -{discount}% {W.discount[lang]}
                  </span>
                )}
              </div>
              <p className={`text-[26px] font-black tracking-tight mb-1 ${highlight ? "text-white" : "text-black"}`}>
                {tier.label[lang]}
              </p>
              <p className={`text-[13px] mb-4 ${highlight ? "text-white/50" : "text-black/40"}`}>
                {tier.range[lang]}
              </p>
              <p className={`text-[13px] leading-relaxed mb-5 ${highlight ? "text-white/60" : "text-black/50"}`}>
                {tier.desc[lang]}
              </p>
              <div className={`pt-4 border-t ${highlight ? "border-white/10" : "border-black/8"}`}>
                <p className={`text-[9px] font-bold uppercase tracking-[0.12em] mb-1 ${highlight ? "text-white/30" : "text-black/25"}`}>
                  {lang === "ru" ? "Доставка" : "Расонидан"}
                </p>
                <p className={`text-[13px] font-semibold ${highlight ? "text-white" : "text-black"}`}>
                  {tier.delivery[lang]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
