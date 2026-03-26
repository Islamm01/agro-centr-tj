// components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useLang } from "@/components/providers/LangProvider";
import { translations as T } from "@/lib/i18n";
import LangSwitcher from "@/components/ui/LangSwitcher";

export default function Navbar({ cartCount = 0 }: { cartCount?: number }) {
  const { data: session } = useSession();
  const { lang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const nav = T.nav;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/96 backdrop-blur-md border-b border-black/8 shadow-[0_1px_12px_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 h-[60px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 bg-[#1a472a] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 3C7 3 4.5 5.5 4.5 8.5C4.5 11.5 7 13.5 10 14.5C13 13.5 15.5 11.5 15.5 8.5C15.5 5.5 13 3 10 3Z" fill="white" fillOpacity="0.9"/>
              <path d="M10 14.5V17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7.5 16.5H12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <span className="font-bold text-[15px] tracking-tight text-black leading-none block">
              Агро Центр
            </span>
            <span className="text-[9px] font-medium text-black/30 tracking-[0.12em] uppercase leading-none block mt-0.5">
              Тоҷикистон
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/catalog" className="text-[13px] font-medium text-black/55 hover:text-black transition-colors">
            {nav.catalog[lang]}
          </Link>
          <Link href="/#wholesale" className="text-[13px] font-medium text-black/55 hover:text-black transition-colors">
            {nav.wholesale[lang]}
          </Link>
          {isAdmin && (
            <Link href="/admin/dashboard" className="text-[13px] font-medium text-[#1a472a] hover:text-[#0d2e1a] transition-colors">
              {nav.admin[lang]}
            </Link>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <LangSwitcher />

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors ml-1"
          >
            <ShoppingCart size={18} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#1a472a] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-black/5 transition-colors"
              >
                <div className="w-6 h-6 bg-[#1a472a] rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold uppercase">
                    {session.user?.name?.[0] ?? "?"}
                  </span>
                </div>
                <ChevronDown size={11} className={`transition-transform ${userOpen ? "rotate-180" : ""}`} />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl border border-black/8 shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-black/5">
                    <p className="text-[12px] font-semibold truncate">{session.user?.name}</p>
                    <p className="text-[11px] text-black/35 truncate">{session.user?.email}</p>
                  </div>
                  <Link href="/orders" onClick={() => setUserOpen(false)} className="block px-4 py-2.5 text-[13px] text-black/65 hover:text-black hover:bg-stone-50 transition-colors">
                    {nav.orders[lang]}
                  </Link>
                  {isAdmin && (
                    <Link href="/admin/dashboard" onClick={() => setUserOpen(false)} className="block px-4 py-2.5 text-[13px] text-black/65 hover:text-black hover:bg-stone-50 transition-colors">
                      {nav.admin[lang]}
                    </Link>
                  )}
                  <button onClick={() => signOut()} className="w-full text-left px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors">
                    {nav.signout[lang]}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-4 py-1.5 bg-[#1a472a] text-white text-[12px] font-semibold rounded-full hover:bg-[#0d2e1a] transition-colors ml-1"
            >
              {nav.signin[lang]}
            </button>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-black/8 px-5 py-5 flex flex-col gap-4">
          {[
            [nav.catalog[lang], "/catalog"],
            [nav.wholesale[lang], "/#wholesale"],
            ...(isAdmin ? [[nav.admin[lang], "/admin/dashboard"]] : []),
            session ? [nav.orders[lang], "/orders"] : [nav.signin[lang], "/api/auth/signin"],
          ].map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-black/65 hover:text-black">
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
