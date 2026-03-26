// components/admin/OrderStatusButton.tsx
"use client";
import { useTransition } from "react";
import { updateOrderStatus } from "@/lib/actions/orders";

const NEXT: Record<string, { value: string; label: string; cls: string }> = {
  PENDING: { value: "CONFIRMED", label: "✓ Принять", cls: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
  CONFIRMED: { value: "COLLECTING", label: "📦 В сборку", cls: "bg-violet-50 text-violet-700 hover:bg-violet-100" },
  COLLECTING: { value: "IN_DELIVERY", label: "🚚 Отправить", cls: "bg-orange-50 text-orange-700 hover:bg-orange-100" },
  IN_DELIVERY: { value: "COMPLETED", label: "✅ Завершить", cls: "bg-green-50 text-green-700 hover:bg-green-100" },
};

export default function OrderStatusButton({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const next = NEXT[currentStatus];
  if (!next) return null;

  return (
    <button
      onClick={() => startTransition(() => updateOrderStatus(orderId, next.value as any))}
      disabled={isPending}
      className={`px-3 py-1.5 text-[11px] font-black rounded-full transition-colors ${next.cls}`}
    >
      {isPending ? "..." : next.label}
    </button>
  );
}
