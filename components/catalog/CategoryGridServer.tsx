// components/catalog/CategoryGridServer.tsx
import prisma from "@/lib/prisma";
import CategoryGrid from "./CategoryGrid";

export default async function CategoryGridServer() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
  return <CategoryGrid categories={categories} />;
}
