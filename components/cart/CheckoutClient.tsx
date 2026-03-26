// components/cart/CheckoutClient.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/providers/LangProvider";
import { formatTJS, translations as T } from "@/lib/i18n";
import { createOrder } from "@/lib/actions/orders";

function getOrderTier(kg: number) {
  if (kg < 20) return { label: { ru: "Розничный", tj: "Чаканагӣ" }, mult: 1.0 };
  if (kg < 600) return { label: { ru: "Оптовый", tj: "Яклухт" }, mult: 0.88 };
  if (kg < 1000) return { label: { ru: "Крупный опт", tj: "Яклухти калон" }, mult: 0.78 };
  return { label: { ru: "Промышленный", tj: "Саноатӣ" }, mult: 0.70 };
}

const INPUT = "w-full px-4 py-3 border border-black/10 rounded-xl text-[14px] bg-[#f7f5f0] focus:bg-white focus:border-[#1a472a]/40 focus:outline-none transition-all placeholder:text-black/25";
const LABEL = "block text-[11px] font-bold uppercase tracking-[0.1em] text-black/35 mb-1.5";

export default function CheckoutClient({ items, user }: { items: any[]; user: any }) {
  const { lang } = useLang();
  const CO = T.checkout;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [delivery, setDelivery] = useState("LOCAL_DELIVERY");

  const totalWeight = items.reduce((s: number, i: any) => s + Number(i.quantity), 0);
  const tier = getOrderTier(totalWeight);
  const subtotal = items.reduce((s: number, i: any) => s + Number(i.product.pricePerKg) * Number(i.quantity), 0);
  const deliveryFee = delivery === "PICKUP" ? 0 : totalWeight < 20 ? 10 : totalWeight < 600 ? 30 : 80;
  const total = subtotal + deliveryFee;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await createOrder({
        name: fd.get("name") as string,
        phone: fd.get("phone") as string,
        address: fd.get("address") as string || undefined,
        city: fd.get("city") as string || undefined,
        deliveryMethod: delivery,
        notes: fd.get("notes") as string || undefined,
      });
      if (result.success && result.data) {
        router.push(`/orders/${result.data.orderNumber}?new=1`);
      } else {
        setError(result.error ?? "Ошибка оформления заказа");
      }
    });
  }

  const deliveryOptions = [
    { value: "PICKUP", label: CO.pickup, fee: CO.free },
    { value: "LOCAL_DELIVERY", label: CO.local_delivery, fee: "10 сом." },
    { value: "TRUCK_DELIVERY", label: CO.truck, fee: "30–80 сом." },
    ...(tier.mult < 0.75 ? [{ value: "NEGOTIATED", label: CO.negotiated, fee: "—" }] : []),
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-[34px] font-black text-black tracking-tight mb-10">{CO.title[lang]}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact */}
            <div className="space-y-4">
              <h2 className="text-[17px] font-black">{CO.contact[lang]}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={LABEL}>{CO.name[lang]} *</label>
                  <input name="name" required defaultValue={user?.name ?? ""} className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>{CO.phone[lang]} *</label>
                  <input name="phone" required placeholder="+992 __ ___ __ __" className={INPUT} />
                </div>
              </div>
            </div>

            {/* Delivery method */}
            <div>
              <h2 className="text-[17px] font-black mb-4">{CO.delivery_method[lang]}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {deliveryOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      delivery === opt.value
                        ? "border-[#1a472a] bg-[#1a472a]/4"
                        : "border-black/8 bg-[#f7f5f0] hover:border-black/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        delivery === opt.value ? "border-[#1a472a]" : "border-black/20"
                      }`}>
                        {delivery === opt.value && <div className="w-2 h-2 rounded-full bg-[#1a472a]" />}
                      </div>
                      <input type="radio" value={opt.value} checked={delivery === opt.value} onChange={() => setDelivery(opt.value)} className="sr-only" />
                      <span className="text-[13px] font-semibold">{opt.label[lang]}</span>
                    </div>
                    <span className="text-[12px] font-bold text-black/35">{opt.fee[lang]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Address */}
            {delivery !== "PICKUP" && (
              <div className="space-y-4">
                <h2 className="text-[17px] font-black">{CO.delivery_address[lang]}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={LABEL}>{CO.address[lang]}</label>
                    <input name="address" className={INPUT} />
                  </div>
                  <div>
                    <label className={LABEL}>{CO.city[lang]}</label>
                    <input name="city" defaultValue="Душанбе" className={INPUT} />
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <h2 className="text-[17px] font-black mb-4">{CO.notes[lang]}</h2>
              <textarea name="notes" rows={3} placeholder={CO.notes_placeholder[lang]} className={`${INPUT} resize-none`} />
            </div>
          </div>

          {/* RIGHT — summary */}
          <div className="space-y-4">
            <div className="bg-[#f7f5f0] rounded-2xl p-6 space-y-4 sticky top-24">
              <h3 className="text-[16px] font-black">
                {lang === "ru" ? "Ваш заказ" : "Фармоиши шумо"}
              </h3>

              {/* Tier badge */}
              <div className="bg-[#1a472a] text-white rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-[13px] font-bold">{tier.label[lang]}</span>
                <span className="text-[12px] text-white/50">{totalWeight.toFixed(1)} кг</span>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {items.map((i: any) => (
                  <div key={i.id} className="flex justify-between text-[12px]">
                    <span className="text-black/55 truncate mr-2">
                      {lang === "ru" ? i.product.nameRu : i.product.nameTj} × {Number(i.quantity)}кг
                    </span>
                    <span className="font-bold shrink-0">{formatTJS(Number(i.product.pricePerKg) * Number(i.quantity))}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-3 border-t border-black/8">
                <div className="flex justify-between text-[13px]">
                  <span className="text-black/45">{T.cart.subtotal[lang]}</span>
                  <span className="font-bold">{formatTJS(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-black/45">{T.cart.delivery_fee[lang]}</span>
                  <span className="font-bold">{deliveryFee > 0 ? formatTJS(deliveryFee) : CO.free[lang]}</span>
                </div>
                <div className="flex justify-between text-[16px] font-black pt-2 border-t border-black/8">
                  <span>{T.cart.total[lang]}</span>
                  <span className="text-[#1a472a]">{formatTJS(total)}</span>
                </div>
              </div>

              {error && <p className="text-[12px] text-red-500 px-3 py-2 bg-red-50 rounded-xl">{error}</p>}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-[#1a472a] text-white text-[15px] font-black rounded-2xl hover:bg-[#0d2e1a] transition-colors disabled:opacity-50 flex items-center justify-center shadow-[0_4px_20px_rgba(26,71,42,0.25)]"
              >
                {isPending
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : CO.place_order[lang]}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
