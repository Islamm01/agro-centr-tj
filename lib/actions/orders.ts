// lib/actions/orders.ts
"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions, isAdmin } from "@/lib/auth";
import { notifyNewOrder, notifyStatusChange } from "@/lib/telegram/notify";
import { OrderStatus } from "@prisma/client";

function generateOrderNumber() {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(Math.random() * 99999).toString().padStart(5, "0");
  return `АЦ${yy}${mm}-${rand}`;
}

function getOrderType(totalKg: number): string {
  if (totalKg < 20) return "RETAIL";
  if (totalKg < 600) return "WHOLESALE";
  if (totalKg < 1000) return "BULK";
  return "INDUSTRIAL";
}

function getDeliveryFee(orderType: string, deliveryMethod: string): number {
  if (deliveryMethod === "PICKUP") return 0;
  const fees: Record<string, number> = { RETAIL: 10, WHOLESALE: 30, BULK: 80, INDUSTRIAL: 0 };
  return fees[orderType] ?? 0;
}

export async function createOrder(formData: {
  name: string;
  phone: string;
  address?: string;
  city?: string;
  deliveryMethod: string;
  notes?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Требуется авторизация" };

  const userId = (session.user as any).id;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (!cartItems.length) return { success: false, error: "Корзина пуста" };

  const totalWeight = cartItems.reduce((s, i) => s + Number(i.quantity), 0);
  const orderType = getOrderType(totalWeight);
  const deliveryFee = getDeliveryFee(orderType, formData.deliveryMethod);
  const orderNumber = generateOrderNumber();

  const orderItemsData = cartItems.map((item) => ({
    productId: item.productId,
    productName: item.product.nameRu,
    quantity: item.quantity,
    unitPrice: item.product.pricePerKg,
    totalPrice: Number(item.product.pricePerKg) * Number(item.quantity),
    unit: item.product.unit,
  }));

  const subtotal = orderItemsData.reduce((s, i) => s + i.totalPrice, 0);
  const totalAmount = subtotal + deliveryFee;

  try {
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          orderType: orderType as any,
          deliveryMethod: formData.deliveryMethod as any,
          totalAmount,
          deliveryFee,
          customerName: formData.name,
          customerPhone: formData.phone,
          deliveryAddress: formData.address,
          deliveryCity: formData.city,
          notes: formData.notes,
          items: { create: orderItemsData },
        },
      });

      await tx.orderStatusLog.create({
        data: { orderId: newOrder.id, status: "PENDING", note: "Заказ оформлен клиентом" },
      });

      // Deduct stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: Number(item.quantity) } },
        });
        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            change: -Number(item.quantity),
            reason: "SALE",
            reference: orderNumber,
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { userId } });
      return newOrder;
    });

    // 🔔 Telegram notification (non-blocking)
    notifyNewOrder({
      orderNumber,
      customerName: formData.name,
      customerPhone: formData.phone,
      orderType,
      deliveryMethod: formData.deliveryMethod,
      deliveryCity: formData.city,
      deliveryAddress: formData.address,
      items: orderItemsData.map((i) => ({
        productName: i.productName,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
        totalPrice: i.totalPrice,
      })),
      totalAmount,
      notes: formData.notes,
    }).catch(console.error);

    revalidatePath("/cart");
    revalidatePath("/orders");
    return { success: true, data: { orderId: order.id, orderNumber } };
  } catch (e: any) {
    return { success: false, error: "Ошибка создания заказа. Попробуйте ещё раз." };
  }
}

export async function getUserOrders() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];
  const userId = (session.user as any).id;
  return prisma.order.findMany({
    where: { userId },
    include: { items: true, statusLogs: { orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderByNumber(orderNumber: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const userId = (session.user as any).id;
  const isUserAdmin = isAdmin(session);

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true, user: true, statusLogs: { orderBy: { createdAt: "desc" } } },
  });

  if (!order) return null;
  if (!isUserAdmin && order.userId !== userId) return null;
  return order;
}

// ── ADMIN ──────────────────────────────────

export async function getAllOrders(opts?: { status?: string; page?: number; limit?: number }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return null;

  const { status, page = 1, limit = 20 } = opts ?? {};
  const skip = (page - 1) * limit;
  const where: any = {};
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: { select: { productName: true, quantity: true, totalPrice: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, totalPages: Math.ceil(total / limit) };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, note?: string) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return { success: false, error: "Нет доступа" };

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });
  if (!order) return { success: false, error: "Заказ не найден" };

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status } }),
    prisma.orderStatusLog.create({
      data: {
        orderId,
        status,
        note: note ?? `Статус обновлён: ${status}`,
        createdBy: (session as any)?.user?.email,
      },
    }),
  ]);

  // Telegram notification on status change
  notifyStatusChange(order.orderNumber, status, order.customerName).catch(console.error);

  revalidatePath("/admin/orders");
  return { success: true };
}
