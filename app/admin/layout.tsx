// app/admin/layout.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions, isAdmin } from "@/lib/auth";
import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) redirect("/");

  const nav = [
    { href: "/admin/dashboard", label: "Дашборд", icon: LayoutDashboard },
    { href: "/admin/products", label: "Товары", icon: Package },
    { href: "/admin/orders", label: "Заказы", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5f0] flex">
      <aside className="w-56 bg-white border-r border-black/8 flex flex-col shrink-0 fixed top-0 left-0 h-full z-30">
        <div className="px-5 py-5 border-b border-black/8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#1a472a] rounded-lg flex items-center justify-center">
              <span className="text-white text-[11px] font-black">А</span>
            </div>
            <div>
              <span className="text-[13px] font-black text-black">Агро Центр</span>
              <span className="block text-[9px] text-black/30 uppercase tracking-widest">Admin</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-black/45 hover:text-black hover:bg-stone-50 transition-colors">
              <Icon size={15} strokeWidth={1.8} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-black/8">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-black/35 hover:text-black hover:bg-stone-50 transition-colors">
            <LogOut size={15} strokeWidth={1.8} />
            На сайт
          </Link>
        </div>
      </aside>
      <main className="flex-1 ml-56 min-h-screen">{children}</main>
    </div>
  );
}
