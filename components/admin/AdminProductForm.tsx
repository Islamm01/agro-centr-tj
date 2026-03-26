// components/admin/AdminProductForm.tsx
"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/actions/products";

const INPUT = "w-full px-4 py-2.5 border border-black/10 rounded-xl text-[13px] bg-stone-50 focus:bg-white focus:border-[#1a472a]/40 focus:outline-none transition-all";
const LABEL = "block text-[10px] font-bold uppercase tracking-[0.1em] text-black/35 mb-1.5";

export default function AdminProductForm({ categories, initial, productId }: { categories: any[]; initial?: any; productId?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      nameRu: fd.get("nameRu"), nameTj: fd.get("nameTj"),
      descriptionRu: fd.get("descriptionRu"), descriptionTj: fd.get("descriptionTj"),
      pricePerKg: Number(fd.get("pricePerKg")),
      minimumOrder: Number(fd.get("minimumOrder") ?? 1),
      maximumOrder: fd.get("maximumOrder") ? Number(fd.get("maximumOrder")) : undefined,
      categoryId: fd.get("categoryId"),
      originRegion: fd.get("originRegion"),
      stockQuantity: Number(fd.get("stockQuantity") ?? 0),
      imageUrl: fd.get("imageUrl") || undefined,
      isFeatured: fd.get("isFeatured") === "on",
      isOrganic: fd.get("isOrganic") === "on",
      harvestSeason: fd.get("harvestSeason") || undefined,
    };

    setError(null);
    startTransition(async () => {
      const result = productId ? await updateProduct(productId, data) : await createProduct(data);
      if (result.success) router.push("/admin/products");
      else setError(result.error ?? "Ошибка");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Название (RU) *</label>
          <input name="nameRu" required defaultValue={initial?.nameRu} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Ном (TJ) *</label>
          <input name="nameTj" required defaultValue={initial?.nameTj} className={INPUT} />
        </div>
      </div>

      <div>
        <label className={LABEL}>Описание (RU) *</label>
        <textarea name="descriptionRu" required rows={3} defaultValue={initial?.descriptionRu} className={`${INPUT} resize-none`} />
      </div>
      <div>
        <label className={LABEL}>Тавсиф (TJ) *</label>
        <textarea name="descriptionTj" required rows={3} defaultValue={initial?.descriptionTj} className={`${INPUT} resize-none`} />
      </div>

      <div>
        <label className={LABEL}>Категория *</label>
        <select name="categoryId" required defaultValue={initial?.categoryId} className={INPUT}>
          <option value="">Выбрать...</option>
          {categories.map((c: any) => <option key={c.id} value={c.id}>{c.nameRu}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className={LABEL}>Цена (TJS/кг) *</label>
          <input name="pricePerKg" type="number" step="0.01" required defaultValue={initial?.pricePerKg} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Склад (кг) *</label>
          <input name="stockQuantity" type="number" step="0.1" required defaultValue={initial?.stockQuantity ?? 0} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Мин. заказ (кг)</label>
          <input name="minimumOrder" type="number" step="0.5" defaultValue={initial?.minimumOrder ?? 1} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Макс. заказ (кг)</label>
          <input name="maximumOrder" type="number" step="1" defaultValue={initial?.maximumOrder} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Регион *</label>
          <input name="originRegion" required defaultValue={initial?.originRegion} placeholder="Хатлон, Согд..." className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Сезон сбора</label>
          <input name="harvestSeason" defaultValue={initial?.harvestSeason} placeholder="Май–Август" className={INPUT} />
        </div>
      </div>

      <div>
        <label className={LABEL}>URL фото</label>
        <input name="imageUrl" type="url" defaultValue={initial?.imageUrl} placeholder="https://..." className={INPUT} />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="isFeatured" defaultChecked={initial?.isFeatured} className="w-4 h-4 accent-[#1a472a]" />
          <span className="text-[13px] font-semibold text-black/65">Популярное</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="isOrganic" defaultChecked={initial?.isOrganic} className="w-4 h-4 accent-[#1a472a]" />
          <span className="text-[13px] font-semibold text-black/65">Органическое</span>
        </label>
      </div>

      {error && <p className="px-4 py-3 bg-red-50 text-red-600 text-[13px] rounded-xl">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending}
          className="px-7 py-3 bg-[#1a472a] text-white text-[14px] font-black rounded-xl hover:bg-[#0d2e1a] transition-colors disabled:opacity-50">
          {isPending ? "Сохраняю..." : productId ? "Обновить" : "Создать товар"}
        </button>
        <a href="/admin/products" className="px-7 py-3 border border-black/10 text-black text-[14px] font-semibold rounded-xl hover:bg-stone-50 transition-colors">
          Отмена
        </a>
      </div>
    </form>
  );
}
