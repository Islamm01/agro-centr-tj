// app/admin/orders/page.tsx
import prisma from "@/lib/prisma";
import { formatTJS } from "@/lib/i18n";
import Link from "next/link";
import OrderStatusButton from "@/components/admin/OrderStatusButton";

export const dynamic = "force-dynamic";

const TABS = [
  { label: "Все", value: "" },
  { label: "Ожидают", value: "PENDING" },
  { label: "Подтверждены", value: "CONFIRMED" },
  { label: "Сборка", value: "COLLECTING" },
  { label: "Доставка", value: "IN_DELIVERY" },
  { label: "Завершены", value: "COMPLETED" },
];

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  COLLECTING: "bg-violet-50 text-violet-700 border-violet-200",
  IN_DELIVERY: "bg-orange-50 text-orange-700 border-orange-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_RU: Record<string, string> = {
  PENDING: "Ожидает", CONFIRMED: "Подтверждён", COLLECTING: "Собирается",
  IN_DELIVERY: "В доставке", COMPLETED: "Завершён", CANCELLED: "Отменён",
};

const ORDER_TYPE_RU: Record<string, string> = {
  RETAIL: "Розничный", WHOLESALE: "Оптовый", BULK: "Крупный опт", INDUSTRIAL: "Промышленный",
};

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string; page?: string } }) {
  const page = Number(searchParams.page ?? 1);
  const limit = 15;
  const where: any = {};
  if (searchParams.status) where.status = searchParams.status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { productName: true, quantity: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-[26px] font-black text-black">Заказы</h1>
        <p className="text-[13px] text-black/35 mt-0.5">{total} заказов</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/orders${tab.value ? `?status=${tab.value}` : ""}`}
            className={`px-4 py-2 rounded-full text-[12px] font-bold transition-colors ${
              (searchParams.status ?? "") === tab.value
                ? "bg-[#1a472a] text-white"
                : "bg-white text-black/45 border border-black/10 hover:text-black"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-black/5">
                {["Номер", "Клиент / Телефон", "Тип", "Товаров", "Сумма", "Статус", "Дата", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-black/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/4">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-black font-mono text-black">{o.orderNumber}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-[13px] font-semibold">{o.customerName}</p>
                    <p className="text-[11px] text-black/35">{o.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[11px] font-bold bg-black/5 px-2.5 py-0.5 rounded-full text-black/55">
                      {ORDER_TYPE_RU[o.orderType] ?? o.orderType}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-black/50">{o.items.length} поз.</td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-black text-[#1a472a]">{formatTJS(Number(o.totalAmount))}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${STATUS_COLOR[o.status]}`}>
                      {STATUS_RU[o.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[11px] text-black/35">
                    {new Date(o.createdAt).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-3.5">
                    <OrderStatusButton orderId={o.id} currentStatus={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!orders.length && (
          <div className="py-16 text-center text-[14px] text-black/25">Заказов нет</div>
        )}
      </div>
    </div>
  );
}
