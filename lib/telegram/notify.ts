// lib/telegram/notify.ts — Telegram notification service

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

interface TelegramOrder {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  orderType: string;
  deliveryMethod: string;
  deliveryCity?: string | null;
  deliveryAddress?: string | null;
  items: { productName: string; quantity: number; unitPrice: number; totalPrice: number }[];
  totalAmount: number;
  notes?: string | null;
}

const ORDER_TYPE_RU: Record<string, string> = {
  RETAIL: "Розничный (0–20 кг)",
  WHOLESALE: "Оптовый (20–600 кг)",
  BULK: "Крупный опт (600 кг – 1 т)",
  INDUSTRIAL: "Промышленный (1 т+)",
};

const DELIVERY_RU: Record<string, string> = {
  PICKUP: "Самовывоз",
  LOCAL_DELIVERY: "Местная доставка",
  TRUCK_DELIVERY: "Грузовая доставка",
  NEGOTIATED: "Договорная логистика",
};

function buildOrderMessage(order: TelegramOrder, recipientType: "admin" | "collector"): string {
  const header =
    recipientType === "admin"
      ? `🛒 *НОВЫЙ ЗАКАЗ — AGRO ЦЕНТР ТЖ*`
      : `📦 *ЗАДАНИЕ НА СБОРКУ — AGRO ЦЕНТР ТЖ*`;

  const items = order.items
    .map((i) => `  • ${i.productName}: ${i.quantity} кг × ${formatTJSRaw(i.unitPrice)} = *${formatTJSRaw(i.totalPrice)}*`)
    .join("\n");

  const deliveryInfo =
    order.deliveryMethod !== "PICKUP" && order.deliveryAddress
      ? `\n📍 *Адрес:* ${order.deliveryCity ?? ""} — ${order.deliveryAddress}`
      : `\n📍 *Доставка:* ${DELIVERY_RU[order.deliveryMethod] ?? order.deliveryMethod}`;

  const notesLine = order.notes
    ? `\n💬 *Примечание:* ${order.notes}`
    : "";

  const collectorNote =
    recipientType === "collector"
      ? `\n\n⚡ *Пожалуйста, начните сборку немедленно и обновите статус в панели управления.*`
      : `\n\n✅ _Сборщик уведомлён автоматически._`;

  return (
    `${header}\n\n` +
    `🔢 *Заказ №:* \`${order.orderNumber}\`\n` +
    `👤 *Клиент:* ${escapeMarkdown(order.customerName)}\n` +
    `📞 *Телефон:* ${order.customerPhone}\n` +
    `📊 *Тип:* ${ORDER_TYPE_RU[order.orderType] ?? order.orderType}` +
    deliveryInfo +
    `\n\n*Состав заказа:*\n${items}\n\n` +
    `💰 *ИТОГО: ${formatTJSRaw(order.totalAmount)} сомони*` +
    notesLine +
    collectorNote
  );
}

function formatTJSRaw(amount: number): string {
  return new Intl.NumberFormat("ru-TJ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
}

async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });

    const data = await res.json();
    if (!data.ok) {
      console.error("Telegram error:", data.description);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Telegram send failed:", err);
    return false;
  }
}

export async function notifyNewOrder(order: TelegramOrder): Promise<void> {
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  const collectorChatId = process.env.TELEGRAM_COLLECTOR_CHAT_ID;

  const promises: Promise<boolean>[] = [];

  if (adminChatId) {
    const adminMsg = buildOrderMessage(order, "admin");
    promises.push(sendTelegramMessage(adminChatId, adminMsg));
  }

  if (collectorChatId) {
    const collectorMsg = buildOrderMessage(order, "collector");
    promises.push(sendTelegramMessage(collectorChatId, collectorMsg));
  }

  if (promises.length === 0) {
    console.warn("No Telegram chat IDs configured (TELEGRAM_ADMIN_CHAT_ID / TELEGRAM_COLLECTOR_CHAT_ID)");
    return;
  }

  await Promise.allSettled(promises);
}

export async function notifyStatusChange(
  orderNumber: string,
  newStatus: string,
  customerName: string
): Promise<void> {
  const STATUS_LABELS: Record<string, string> = {
    CONFIRMED: "✅ Подтверждён",
    COLLECTING: "📦 Сборщик начал сборку",
    IN_DELIVERY: "🚚 Передан в доставку",
    COMPLETED: "✅ Заказ завершён",
    CANCELLED: "❌ Заказ отменён",
  };

  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!adminChatId) return;

  const label = STATUS_LABELS[newStatus] ?? newStatus;
  const text = `🔄 *Статус заказа обновлён*\n\nЗаказ №: \`${orderNumber}\`\nКлиент: ${escapeMarkdown(customerName)}\nСтатус: ${label}`;

  await sendTelegramMessage(adminChatId, text);
}
