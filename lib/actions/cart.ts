// lib/actions/cart.ts
"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function getCart() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];
  const userId = (session.user as any).id;
  return prisma.cartItem.findMany({
    where: { userId },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function getCartCount(): Promise<number> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return 0;
  const userId = (session.user as any).id;
  return prisma.cartItem.count({ where: { userId } });
}

export async function addToCart(productId: string, quantity: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Требуется авторизация" };
  const userId = (session.user as any).id;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) return { success: false, error: "Продукт недоступен" };
  if (Number(product.stockQuantity) < quantity) return { success: false, error: "Недостаточно на складе" };

  await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId, productId, quantity },
  });

  revalidatePath("/cart");
  return { success: true };
}

export async function updateCartItem(productId: string, quantity: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Не авторизован" };
  const userId = (session.user as any).id;

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { userId_productId: { userId, productId } } });
  } else {
    await prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity },
    });
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function removeFromCart(productId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false };
  const userId = (session.user as any).id;
  await prisma.cartItem.delete({ where: { userId_productId: { userId, productId } } });
  revalidatePath("/cart");
  return { success: true };
}
