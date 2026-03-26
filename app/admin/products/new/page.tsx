// app/admin/products/new/page.tsx
import prisma from "@/lib/prisma";
import AdminProductForm from "@/components/admin/AdminProductForm";
export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  return (
    <div className="p-8 max-w-2xl">
      <a href="/admin/products" className="text-[13px] text-black/35 hover:text-black inline-block mb-6">← Назад к товарам</a>
      <h1 className="text-[26px] font-black text-black mb-8">Добавить товар</h1>
      <AdminProductForm categories={categories} />
    </div>
  );
}
