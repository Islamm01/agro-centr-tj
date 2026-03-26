// components/catalog/AddToCartButton.tsx
"use client";

import { useState, useTransition } from "react";
import { Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { addToCart } from "@/lib/actions/cart";
import { formatTJS } from "@/lib/i18n";
import { useLang } from "@/components/providers/LangProvider";
import { translations as T } from "@/lib/i18n";

function getOrderTier(kg: number) {
  if (kg < 20) return { label: { ru: "Розничный", tj: "Чаканагӣ" }, multiplier: 1.0 };
  if (kg < 600) return { label: { ru: "Оптовый", tj: "Яклухт" }, multiplier: 0.88 };
  if (kg < 1000) return { label: { ru: "Крупный опт", tj: "Яклухти калон" }, multiplier: 0.78 };
  return { label: { ru: "Промышленный", tj: "Саноатӣ" }, multiplier: 0.70 };
}

export default function AddToCartButton({
  productId, minimumOrder, maximumOrder, stockQuantity, pricePerKg, inStock,
}: {
  productId: string; minimumOrder: number; maximumOrder?: number;
  stockQuantity: number; pricePerKg: number; inStock: boolean;
}) {
  const { lang } = useLang();
  const P = T.product;
  const [qty, setQty] = useState(minimumOrder);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const max = Math.min(maximumOrder ?? stockQuantity, stockQuantity);
  const tier = getOrderTier(qty);
  const effectivePrice = pricePerKg * tier.multiplier;

  function handleAdd() {
    setError(null);
    startTransition(async () => {
      const res = await addToCart(productId, qty);
      if (res.success) { setAdded(true); setTimeout(() => setAdded(false), 2500); }
      else setError(res.error ?? "Ошибка");
    });
  }

  if (!inStock) return (
    <div className="p-4 bg-[#f7f5f0] rounded-xl text-center text-[14px] text-black/40">
      {T.catalog.out_of_stock[lang]}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Quantity */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#f7f5f0] rounded-2xl p-1.5">
          <button
            onClick={() => setQty(q => Math.max(q - 1, minimumOrder))}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30"
            disabled={qty <= minimumOrder}
          >
            <Minus size={14} />
          </button>
          <span className="text-[15px] font-black w-20 text-center">{qty} кг</span>
          <button
            onClick={() => setQty(q => Math.min(q + 1, max))}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30"
            disabled={qty >= max}
          >
            <Plus size={14} />
          </button>
        </div>
        <div>
          <p className="text-[22px] font-black text-[#1a472a]">{formatTJS(effectivePrice * qty)}</p>
          <p className="text-[11px] text-black/30">{formatTJS(effectivePrice)}/кг · {tier.label[lang]}</p>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={isPending || added}
        className={`w-full py-4 rounded-2xl text-[15px] font-black flex items-center justify-center gap-2 transition-all duration-300 ${
          added ? "bg-[#1a472a] text-white" : "bg-[#1a472a] text-white hover:bg-[#0d2e1a]"
        } shadow-[0_4px_20px_rgba(26,71,42,0.25)]`}
      >
        {added ? (<><Check size={18} /> {P.added[lang]}</>) :
         isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
         (<><ShoppingCart size={18} /> {P.add_to_cart[lang]}</>)}
      </button>

      {error && <p className="text-[12px] text-red-500 text-center">{error}</p>}
    </div>
  );
}
