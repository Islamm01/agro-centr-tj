// components/cart/OrderDetailClient.tsx
"use client";

import Link from "next/link";
import { useLang } from "@/components/providers/LangProvider";
import { formatTJS, translations as T } from "@/lib/i18n";

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  COLLECTING: "bg-violet-50 text-violet-700 border-violet-200",
  IN_DELIVERY: "bg-orange-50 text-orange-700 border-orange-200",
  COMPLETED: "bg-[#1a472a]/8 text-[#1a472a] border-[#1a472a]/20",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

export default function OrderDetailClient({ order, isNew }: { order: any; isNew?: boolean }) {
  const { lang } = useLang();
  const S = T.order_success;
  const ST = T.status;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {isNew && (
        <div className="mb-10 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-[32px] font-black text-black tracking-tight mb-2">{S.title[lang]}</h1>
          <p className="text-[15px] text-black/50 leading-relaxed">{S.subtitle[lang]}</p>
        </div>
      )}

      <div className="bg-[#f7f5f0] rounded-3xl p-7 space-y-6">
        {/* Order number */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-black/30 mb-1">{S.order_number[lang]}</p>
            <p className="text-[22px] font-black font-mono text-black tracking-tight">{order.orderNumber}</p>
          </div>
          <span className={`px-3 py-1.5 text-[12px] font-bold rounded-full border ${STATUS_COLOR[order.status]}`}>
            {ST[order.status as keyof typeof ST]?.[lang] ?? order.status}
          </span>
        </div>

        {/* Customer */}
        <div className="pt-4 border-t border-black/8">
          <p className="text-[13px] text-black/50 mb-1">📞 {order.customerPhone}</p>
          {order.deliveryAddress && <p className="text-[13px] text-black/50">📍 {order.deliveryCity} — {order.deliveryAddress}</p>}
          {order.notes && <p className="text-[13px] text-black/40 mt-1 italic">💬 {order.notes}</p>}
        </div>

        {/* Items */}
        <div className="pt-4 border-t border-black/8 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-black/30 mb-3">
            {lang === "ru" ? "Состав заказа" : "Таркиби фармоиш"}
          </p>
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between text-[14px]">
              <span className="text-black/60">{item.productName} × {Number(item.quantity)} кг</span>
              <span className="font-bold">{formatTJS(Number(item.totalPrice))}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between text-[18px] font-black pt-4 border-t border-black/8">
          <span>{T.cart.total[lang]}</span>
          <span className="text-[#1a472a]">{formatTJS(Number(order.totalAmount))}</span>
        </div>

        {/* Status log */}
        {order.statusLogs?.length > 0 && (
          <div className="pt-4 border-t border-black/8">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-black/30 mb-3">
              {lang === "ru" ? "История статусов" : "Таърихи статус"}
            </p>
            <div className="space-y-2">
              {order.statusLogs.map((log: any) => (
                <div key={log.id} className="flex items-start gap-2 text-[12px]">
                  <span className={`shrink-0 px-2 py-0.5 rounded-full border text-[10px] font-bold ${STATUS_COLOR[log.status]}`}>
                    {ST[log.status as keyof typeof ST]?.[lang]}
                  </span>
                  {log.note && <span className="text-black/40">{log.note}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6 justify-center">
        <Link href="/orders" className="px-6 py-3 bg-[#1a472a] text-white text-[13px] font-bold rounded-full hover:bg-[#0d2e1a] transition-colors">
          {S.view_orders[lang]}
        </Link>
        <Link href="/catalog" className="px-6 py-3 border border-black/12 text-black text-[13px] font-semibold rounded-full hover:bg-black/4 transition-colors">
          {S.continue[lang]}
        </Link>
      </div>
    </div>
  );
}
