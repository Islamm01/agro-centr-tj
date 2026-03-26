// components/ui/LangSwitcher.tsx
"use client";
import { useLang } from "@/components/providers/LangProvider";

export default function LangSwitcher({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang();
  const base = dark ? "text-white/60 hover:text-white" : "text-black/40 hover:text-black";
  const active = dark ? "text-white font-semibold" : "text-black font-semibold";

  return (
    <div className="flex items-center gap-1 text-[12px]">
      <button
        onClick={() => setLang("ru")}
        className={`px-1 transition-colors ${lang === "ru" ? active : base}`}
      >
        РУ
      </button>
      <span className={dark ? "text-white/20" : "text-black/15"}>|</span>
      <button
        onClick={() => setLang("tj")}
        className={`px-1 transition-colors ${lang === "tj" ? active : base}`}
      >
        ТҶ
      </button>
    </div>
  );
}
