// lib/actions/products.ts
"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions, isAdmin } from "@/lib/auth";

export async function getProducts(opts?: {
  categorySlug?: string;
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}) {
  const { categorySlug, search, page = 1, limit = 12, featured } = opts ?? {};
  const skip = (page - 1) * limit;
  const where: any = { isActive: true };
  if (categorySlug) where.category = { slug: categorySlug };
  if (featured) where.isFeatured = true;
  if (search) {
    where.OR = [
      { nameRu: { contains: search, mode: "insensitive" } },
      { nameTj: { contains: search, mode: "insensitive" } },
      { originRegion: { contains: search, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: { category: true },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { category: true },
    take: 6,
    orderBy: { updatedAt: "desc" },
  });
}

// ── ADMIN ──────────────────────────────────

export async function createProduct(data: any) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return { success: false, error: "Нет доступа" };

  const slug = data.nameRu
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    + "-" + Date.now();

  try {
    const product = await prisma.product.create({ data: { ...data, slug } });
    await prisma.inventoryLog.create({
      data: {
        productId: product.id,
        change: data.stockQuantity,
        reason: "INITIAL",
        note: "Начальный склад",
      },
    });
    revalidatePath("/catalog");
    revalidatePath("/admin/products");
    return { success: true, data: { id: product.id } };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateProduct(id: string, data: any) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return { success: false, error: "Нет доступа" };

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return { success: false, error: "Продукт не найден" };

  await prisma.product.update({ where: { id }, data });

  if (data.stockQuantity !== undefined && Number(data.stockQuantity) !== Number(existing.stockQuantity)) {
    await prisma.inventoryLog.create({
      data: {
        productId: id,
        change: Number(data.stockQuantity) - Number(existing.stockQuantity),
        reason: "ADJUSTMENT",
        note: "Обновлено через панель управления",
      },
    });
  }

  revalidatePath("/catalog");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return { success: false, error: "Нет доступа" };
  await prisma.product.update({ where: { id }, data: { isActive: false } });
  revalidatePath("/catalog");
  revalidatePath("/admin/products");
  return { success: true };
}
