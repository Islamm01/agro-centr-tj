// components/layout/Footer.tsx
"use client";
import Link from "next/link";
import { useLang } from "@/components/providers/LangProvider";
import { translations as T } from "@/lib/i18n";
import LangSwitcher from "@/components/ui/LangSwitcher";

export default function Footer() {
  const { lang } = useLang();
  const F = T.footer;
  const N = T.nav;

  return (
    <footer className="bg-[#111] text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-[#1a472a] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-black">А</span>
              </div>
              <div>
                <span className="font-bold text-[15px] text-white leading-none block">Агро Центр</span>
                <span className="text-[9px] font-medium text-white/30 tracking-widest uppercase block mt-0.5">Тоҷикистон</span>
              </div>
            </div>
            <p className="text-[13px] text-white/40 leading-relaxed max-w-xs">
              {lang === "ru"
                ? "Современная аграрная торговая платформа Таджикистана. Свежие продукты от фермеров напрямую к вам."
                : "Платформаи муосири савдои кишоварзии Тоҷикистон. Маҳсулоти тоза мустақиман аз деҳқонон ба шумо."}
            </p>
            <div className="mt-5">
              <LangSwitcher dark />
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/25 mb-4">{F.platform[lang]}</p>
            <div className="flex flex-col gap-2.5">
              {[
                [N.catalog[lang], "/catalog"],
                [N.wholesale[lang], "/#wholesale"],
                [N.cart[lang], "/cart"],
                [N.orders[lang], "/orders"],
              ].map(([l, h]) => (
                <Link key={h} href={h} className="text-[13px] text-white/45 hover:text-white transition-colors">{l}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/25 mb-4">{F.contact[lang]}</p>
            <div className="flex flex-col gap-2">
              <p className="text-[13px] text-white/45">info@agrocentr.tj</p>
              <p className="text-[13px] text-white/45">+992 44 000 00 00</p>
              <p className="text-[13px] text-white/45">{F.address[lang]}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-white/25">
            © {new Date().getFullYear()} Агро Центр Тоҷикистон. {F.rights[lang]}.
          </p>
        </div>
      </div>
    </footer>
  );
}
