// app/admin/dashboard/page.tsx
import prisma from "@/lib/prisma";
import { formatTJS } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  COLLECTING: "bg-violet-50 text-violet-700",
  IN_DELIVERY: "bg-orange-50 text-orange-700",
  COMPLETED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-600",
};

const STATUS_RU: Record<string, string> = {
  PENDING: "Ожидает", CONFIRMED: "Подтверждён", COLLECTING: "Собирается",
  IN_DELIVERY: "В доставке", COMPLETED: "Завершён", CANCELLED: "Отменён",
};

export default async function AdminDashboard() {
  const [totalOrders, pendingOrders, revenue, activeProducts, recentOrders, lowStock] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: "COMPLETED" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.product.findMany({
      where: { isActive: true, stockQuantity: { lt: 100 } },
      orderBy: { stockQuantity: "asc" },
      take: 6,
    }),
  ]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-[26px] font-black text-black">Дашборд</h1>
        <p className="text-[13px] text-black/35 mt-0.5">Агро Центр Тоҷикистон — панель управления</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Всего заказов", value: totalOrders, note: `${pendingOrders} ожидает` },
          { label: "Выручка (завершённые)", value: formatTJS(Number(revenue._sum.totalAmount ?? 0)), note: "TJS" },
          { label: "Активных товаров", value: activeProducts, note: "в каталоге" },
          { label: "Ожидают подтверждения", value: pendingOrders, note: "требуют действия", urgent: pendingOrders > 0 },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl p-5 border ${s.urgent ? "border-amber-200 bg-amber-50" : "border-black/5"}`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-black/30 mb-2">{s.label}</p>
            <p className={`text-[26px] font-black tracking-tight ${s.urgent ? "text-amber-700" : "text-black"}`}>{s.value}</p>
            <p className="text-[11px] text-black/30 mt-0.5">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-black/5 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
            <h2 className="text-[14px] font-black">Последние заказы</h2>
            <a href="/admin/orders" className="text-[12px] text-[#1a472a] font-semibold hover:underline">Все →</a>
          </div>
          <div className="divide-y divide-black/4">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-stone-50">
                <div>
                  <p className="text-[13px] font-black font-mono">{o.orderNumber}</p>
                  <p className="text-[11px] text-black/35">{o.customerName} · {o.customerPhone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${STATUS_COLOR[o.status]}`}>
                    {STATUS_RU[o.status]}
                  </span>
                  <span className="text-[13px] font-black text-[#1a472a]">{formatTJS(Number(o.totalAmount))}</span>
                </div>
              </div>
            ))}
            {!recentOrders.length && <div className="px-6 py-8 text-center text-[13px] text-black/25">Заказов пока нет</div>}
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
            <h2 className="text-[14px] font-black">Мало на складе</h2>
            <a href="/admin/products" className="text-[12px] text-[#1a472a] font-semibold hover:underline">Управлять →</a>
          </div>
          <div className="divide-y divide-black/4">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-3.5">
                <p className="text-[13px] font-semibold text-black truncate">{p.nameRu}</p>
                <span className={`text-[12px] font-black px-2.5 py-0.5 rounded-full ${
                  Number(p.stockQuantity) < 20 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
                }`}>
                  {Number(p.stockQuantity).toFixed(0)} кг
                </span>
              </div>
            ))}
            {!lowStock.length && <div className="px-6 py-8 text-center text-[12px] text-black/25">Все товары в наличии ✅</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
