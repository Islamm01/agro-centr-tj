// components/catalog/ProductInfo.tsx
"use client";

import { useLang } from "@/components/providers/LangProvider";
import { formatTJS, translations as T } from "@/lib/i18n";
import AddToCartButton from "./AddToCartButton";

export default function ProductInfo({ product }: { product: any }) {
  const { lang } = useLang();
  const P = T.product;
  const name = lang === "ru" ? product.nameRu : product.nameTj;
  const desc = lang === "ru" ? product.descriptionRu : product.descriptionTj;
  const catName = lang === "ru" ? product.category.nameRu : product.category.nameTj;
  const inStock = Number(product.stockQuantity) > 0;

  const pricingRows = [
    { label: lang === "ru" ? "Розничный (0–20 кг)" : "Чаканагӣ (0–20 кг)", price: Number(product.pricePerKg), bold: false },
    { label: lang === "ru" ? "Оптовый (20–600 кг)" : "Яклухт (20–600 кг)", price: Number(product.pricePerKg) * 0.88, badge: "-12%", bold: true },
    { label: lang === "ru" ? "Крупный опт (600 кг–1 т)" : "Яклухти калон (600 кг–1 т)", price: Number(product.pricePerKg) * 0.78, badge: "-22%", bold: false },
    { label: lang === "ru" ? "Промышленный (1 т+)" : "Саноатӣ (1 т+)", note: lang === "ru" ? "Договорная" : "Тавофуқӣ", bold: false },
  ];

  return (
    <div className="lg:py-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/30 mb-2">{catName}</p>
      <h1 className="text-[38px] font-black text-black tracking-tight leading-tight mb-2">{name}</h1>

      <div className="flex flex-wrap gap-3 mb-6 text-[12px] text-black/40">
        <span>📍 {product.originRegion}</span>
        {product.harvestSeason && <span>🌿 {product.harvestSeason}</span>}
        <span>📦 {lang === "ru" ? "Мин." : "Ҳад ақал"} {Number(product.minimumOrder)} кг</span>
      </div>

      <p className="text-[15px] text-black/55 leading-relaxed mb-8">{desc}</p>

      {/* Pricing tiers */}
      <div className="mb-8 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/25 mb-3">{P.pricing_title[lang]}</p>
        {pricingRows.map((row, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-4 py-3 rounded-xl ${
              row.bold ? "bg-[#1a472a] text-white" : "bg-[#f7f5f0]"
            }`}
          >
            <span className={`text-[13px] font-semibold ${row.bold ? "text-white" : "text-black"}`}>
              {row.label}
            </span>
            <div className="flex items-center gap-2">
              {row.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  row.bold ? "bg-white/15 text-white" : "bg-[#1a472a]/8 text-[#1a472a]"
                }`}>
                  {row.badge}
                </span>
              )}
              <span className={`text-[14px] font-black ${row.bold ? "text-white" : "text-black"}`}>
                {row.note ?? `${formatTJS(row.price!)}/кг`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Stock */}
      <div className="flex items-center gap-2 mb-8">
        <div className={`w-2 h-2 rounded-full ${inStock ? "bg-[#1a472a]" : "bg-red-400"}`} />
        <span className="text-[13px] font-semibold text-black/55">
          {inStock
            ? `${Number(product.stockQuantity).toFixed(0)} кг ${lang === "ru" ? "в наличии" : "мавҷуд аст"}`
            : T.catalog.out_of_stock[lang]}
        </span>
      </div>

      <AddToCartButton
        productId={product.id}
        minimumOrder={Number(product.minimumOrder)}
        maximumOrder={product.maximumOrder ? Number(product.maximumOrder) : undefined}
        stockQuantity={Number(product.stockQuantity)}
        pricePerKg={Number(product.pricePerKg)}
        inStock={inStock}
      />
    </div>
  );
}
