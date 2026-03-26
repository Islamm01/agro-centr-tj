// components/cart/CartPageClient.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useLang } from "@/components/providers/LangProvider";
import { formatTJS, translations as T } from "@/lib/i18n";
import { updateCartItem, removeFromCart } from "@/lib/actions/cart";

function getOrderTier(kg: number) {
  if (kg < 20) return { label: { ru: "Розничный", tj: "Чаканагӣ" }, multiplier: 1.0, delivery: { ru: "Самовывоз", tj: "Худ гирифтан" } };
  if (kg < 600) return { label: { ru: "Оптовый", tj: "Яклухт" }, multiplier: 0.88, delivery: { ru: "Малый грузовик", tj: "Мошини хурд" } };
  if (kg < 1000) return { label: { ru: "Крупный опт", tj: "Яклухти калон" }, multiplier: 0.78, delivery: { ru: "Большой грузовик", tj: "Мошини калон" } };
  return { label: { ru: "Промышленный", tj: "Саноатӣ" }, multiplier: 0.70, delivery: { ru: "Договорная", tj: "Тавофуқӣ" } };
}

export default function CartPageClient({ items }: { items: any[] }) {
  const { lang } = useLang();
  const C = T.cart;
  const [isPending, startTransition] = useTransition();

  const totalWeight = items.reduce((s, i) => s + Number(i.quantity), 0);
  const tier = getOrderTier(totalWeight);
  const subtotal = items.reduce((s, i) => s + Number(i.product.pricePerKg) * Number(i.quantity), 0);

  function handleQty(productId: string, qty: number) {
    startTransition(() => updateCartItem(productId, qty));
  }
  function handleRemove(productId: string) {
    startTransition(() => removeFromCart(productId));
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-[36px] font-black text-black tracking-tight mb-10">{C.title[lang]}</h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4 opacity-15">🛒</div>
          <h2 className="text-[22px] font-black text-black/25 mb-2">{C.empty[lang]}</h2>
          <p className="text-[14px] text-black/20 mb-8">{C.empty_sub[lang]}</p>
          <Link href="/catalog" className="px-7 py-3.5 bg-[#1a472a] text-white text-[14px] font-bold rounded-full hover:bg-[#0d2e1a] transition-colors">
            {C.browse[lang]}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item: any) => (
              <div key={item.id} className={`flex gap-4 p-4 bg-[#f7f5f0] rounded-2xl transition-opacity ${isPending ? "opacity-60" : ""}`}>
                <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0">
                  {item.product.imageUrl
                    ? <Image src={item.product.imageUrl} alt={item.product.nameRu} fill className="object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[14px] font-bold text-black">
                        {lang === "ru" ? item.product.nameRu : item.product.nameTj}
                      </p>
                      <p className="text-[11px] text-black/35 mt-0.5">
                        {item.product.originRegion} · {formatTJS(Number(item.product.pricePerKg))}/кг
                      </p>
                    </div>
                    <button onClick={() => handleRemove(item.productId)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shrink-0">
                      <X size={12} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-white rounded-xl p-1">
                      <button onClick={() => handleQty(item.productId, Number(item.quantity) - 1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#f7f5f0] transition-colors">
                        <Minus size={11} />
                      </button>
                      <span className="text-[13px] font-black w-16 text-center">{Number(item.quantity)} кг</span>
                      <button onClick={() => handleQty(item.productId, Number(item.quantity) + 1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#f7f5f0] transition-colors">
                        <Plus size={11} />
                      </button>
                    </div>
                    <p className="text-[15px] font-black">{formatTJS(Number(item.product.pricePerKg) * Number(item.quantity))}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Tier info */}
            <div className="bg-[#1a472a] text-white rounded-2xl p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40 mb-1">{C.tier_label[lang]}</p>
              <p className="text-[20px] font-black">{tier.label[lang]}</p>
              <p className="text-[12px] text-white/50 mt-0.5">{totalWeight.toFixed(1)} кг · {tier.delivery[lang]}</p>
              {tier.multiplier < 1 && (
                <p className="text-[12px] text-[#c8a84b] font-bold mt-1">
                  -{Math.round((1 - tier.multiplier) * 100)}% {C.discount[lang]}
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="bg-[#f7f5f0] rounded-2xl p-5 space-y-3">
              <div className="flex justify-between text-[14px]">
                <span className="text-black/50">{C.subtotal[lang]}</span>
                <span className="font-bold">{formatTJS(subtotal)}</span>
              </div>
              <p className="text-[11px] text-black/30">{C.delivery_info[lang]}</p>
              <div className="flex justify-between text-[17px] font-black pt-2 border-t border-black/8">
                <span>{C.total[lang]}</span>
                <span className="text-[#1a472a]">{formatTJS(subtotal)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block w-full py-4 bg-[#1a472a] text-white text-[15px] font-black text-center rounded-2xl hover:bg-[#0d2e1a] transition-colors shadow-[0_4px_20px_rgba(26,71,42,0.25)]">
              {C.checkout[lang]}
            </Link>
            <Link href="/catalog" className="block w-full py-3 text-[13px] text-black/40 text-center hover:text-black transition-colors">
              {C.continue[lang]}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
