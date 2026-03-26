// components/catalog/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Leaf, ArrowUpRight } from "lucide-react";
import { formatTJS } from "@/lib/i18n";
import { useLang } from "@/components/providers/LangProvider";
import { translations as T } from "@/lib/i18n";

interface Product {
  id: string;
  nameRu: string;
  nameTj: string;
  slug: string;
  pricePerKg: any;
  minimumOrder: any;
  stockQuantity: any;
  imageUrl?: string | null;
  isFeatured: boolean;
  isOrganic: boolean;
  originRegion: string;
  category: { nameRu: string; nameTj: string };
}

export default function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { lang } = useLang();
  const C = T.catalog;
  const [imgError, setImgError] = useState(false);
  const inStock = Number(product.stockQuantity) > 0;
  const name = lang === "ru" ? product.nameRu : product.nameTj;
  const catName = lang === "ru" ? product.category.nameRu : product.category.nameTj;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-[#f0ede6] rounded-2xl overflow-hidden mb-4">
        {product.imageUrl && !imgError ? (
          <Image
            src={product.imageUrl}
            alt={name}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            priority={priority}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🌿</div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.isOrganic && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-white/92 backdrop-blur-sm rounded-full text-[10px] font-semibold text-[#1a472a]">
              <Leaf size={9} />
              {C.organic[lang]}
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2.5 py-1 bg-[#1a472a]/85 backdrop-blur-sm rounded-full text-[10px] font-semibold text-white">
              {C.featured[lang]}
            </span>
          )}
        </div>

        {/* Out of stock */}
        {!inStock && (
          <div className="absolute inset-0 bg-white/55 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1.5 bg-white border border-black/10 rounded-full text-[12px] font-medium text-black/45">
              {C.out_of_stock[lang]}
            </span>
          </div>
        )}

        {/* Arrow hover */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <ArrowUpRight size={13} strokeWidth={2.5} />
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-black/30">{catName}</p>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-bold text-black leading-tight group-hover:text-black/65 transition-colors">
            {name}
          </h3>
          <div className="text-right shrink-0">
            <p className="text-[15px] font-bold text-[#1a472a]">{formatTJS(Number(product.pricePerKg))}</p>
            <p className="text-[10px] text-black/30">{C.per_kg[lang]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-black/35">
          <span>{product.originRegion}</span>
          <span className="text-black/15">·</span>
          <span>{C.min_order[lang]}: {Number(product.minimumOrder)} кг</span>
        </div>
      </div>
    </Link>
  );
}
