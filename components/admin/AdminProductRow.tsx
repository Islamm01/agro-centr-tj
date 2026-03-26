// components/admin/AdminProductRow.tsx
"use client";
import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions/products";
import { formatTJS } from "@/lib/i18n";

export default function AdminProductRow({ product }: { product: any }) {
  const [isPending, startTransition] = useTransition();

  return (
    <tr className="hover:bg-stone-50 transition-colors">
      <td className="px-5 py-3.5">
        <p className="text-[13px] font-bold">{product.nameRu}</p>
        <p className="text-[11px] text-black/35">{product.nameTj} · {product.originRegion}</p>
      </td>
      <td className="px-5 py-3.5 text-[12px] text-black/50">{product.category.nameRu}</td>
      <td className="px-5 py-3.5 text-[13px] font-black text-[#1a472a]">{formatTJS(Number(product.pricePerKg))}</td>
      <td className="px-5 py-3.5">
        <span className={`text-[12px] font-black ${Number(product.stockQuantity) < 50 ? "text-red-500" : "text-black/55"}`}>
          {Number(product.stockQuantity).toFixed(0)} кг
        </span>
      </td>
      <td className="px-5 py-3.5">
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${product.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {product.isActive ? "Активен" : "Скрыт"}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1">
          <Link href={`/admin/products/${product.id}`} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-stone-100 text-black/35 hover:text-black transition-colors">
            <Pencil size={13} />
          </Link>
          <button
            onClick={() => { if (confirm("Архивировать продукт?")) startTransition(() => deleteProduct(product.id)); }}
            disabled={isPending}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-black/35 hover:text-red-500 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}
