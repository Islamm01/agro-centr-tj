# Агро Центр Тоҷикистон — Руководство по запуску

## Что вам нужно установить на MacBook

### Шаг 1: Установите Homebrew (менеджер пакетов для Mac)
Откройте Terminal и выполните:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Шаг 2: Установите Node.js
```bash
brew install node
```
Проверьте:
```bash
node --version   # должно быть v18 или выше
npm --version
```

### Шаг 3: Установите PostgreSQL (база данных)
```bash
brew install postgresql@16
brew services start postgresql@16
```
Создайте базу данных:
```bash
createdb agro_centr_tj
```

---

## Запуск платформы

### 1. Распакуйте архив
```bash
unzip agro-centr-tj.zip
cd agro-centr-tj
```

### 2. Создайте файл настроек
```bash
cp .env.example .env
```
Откройте `.env` в любом текстовом редакторе и заполните:

| Параметр | Что вписать |
|----------|-------------|
| `DATABASE_URL` | `postgresql://postgres:@localhost:5432/agro_centr_tj` |
| `NEXTAUTH_SECRET` | Любой длинный случайный текст (например: `moj-sekretnyj-klyuch-2024`) |
| `NEXTAUTH_URL` | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Из Google Cloud Console (шаг ниже) |
| `GOOGLE_CLIENT_SECRET` | Из Google Cloud Console |
| `TELEGRAM_BOT_TOKEN` | Токен вашего бота от @BotFather |
| `TELEGRAM_ADMIN_CHAT_ID` | Ваш Telegram chat ID |
| `TELEGRAM_COLLECTOR_CHAT_ID` | Chat ID сборщика |

### 3. Установите зависимости и настройте базу данных
```bash
npm install
npm run setup
```
Это создаст все таблицы и загрузит 8 начальных продуктов Таджикистана.

### 4. Запустите
```bash
npm run dev
```

Откройте браузер: **http://localhost:3000**

---

## Настройка Google авторизации

1. Перейдите на https://console.cloud.google.com
2. Создайте новый проект
3. APIs & Services → Credentials → Create OAuth Client ID
4. Application type: **Web application**
5. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Скопируйте Client ID и Client Secret в `.env`

---

## Настройка Telegram уведомлений

### Получить Chat ID (простой способ):
1. Напишите вашему боту `/start` в Telegram
2. Откройте в браузере:
   ```
   https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
   ```
3. Найдите `"chat":{"id": 123456789}` — это ваш Chat ID
4. Вставьте это число в `TELEGRAM_ADMIN_CHAT_ID`

### Для сборщика:
- Если сборщик — отдельный человек: попросите его написать боту `/start` и получите его chat ID аналогично
- Если хотите в группу: создайте группу в Telegram, добавьте бота, и получите ID группы (он будет отрицательным числом: -1001234567890)

---

## Как стать администратором

После регистрации через Google выполните в базе данных:
```bash
# Откройте Prisma Studio
npm run db:studio
```
Найдите свой User, измените поле `role` на `ADMIN`.

Или через SQL:
```bash
psql agro_centr_tj -c "UPDATE \"User\" SET role='ADMIN' WHERE email='ваш@email.com';"
```

---

## Структура платформы

```
/ — Главная страница (RU/TJ, переключатель языков)
/catalog — Каталог продуктов с фильтрами
/product/[slug] — Страница продукта
/cart — Корзина
/checkout — Оформление заказа
/orders/[номер] — Детали заказа (+ страница успеха)

/admin/dashboard — Дашборд с заказами и статистикой
/admin/products — Управление товарами (добавить/редактировать/удалить)
/admin/orders — Все заказы с кнопками изменения статуса
```

---

## Как работает уведомление Telegram

Когда покупатель оформляет заказ:

1. **Администратор получает:** полный состав заказа, данные клиента, сумму, тип (Розничный/Оптовый/Крупный опт)
2. **Сборщик получает:** то же самое + напоминание начать сборку

При изменении статуса в панели администратора — отправляется уведомление о смене статуса.

**Пример уведомления:**
```
📦 ЗАДАНИЕ НА СБОРКУ — AGRO ЦЕНТР ТЖ

🔢 Заказ №: АЦ2403-00142
👤 Клиент: Акбар Рахимов
📞 Телефон: +992 93 123 4567
📊 Тип: Оптовый (20–600 кг)
📍 Адрес: Душанбе — ул. Айни, 45

Состав заказа:
  • Помидоры Хатлон: 50 кг × 4.50 = 225.00
  • Виноград Истаравшан: 30 кг × 12.00 = 360.00

💰 ИТОГО: 585.00 сомони

⚡ Пожалуйста, начните сборку немедленно...
```

---

## Производственное развёртывание (когда готовы)

### Для интернета (Vercel — бесплатно):
```bash
npm install -g vercel
vercel
```
База данных: зарегистрируйтесь на neon.tech (PostgreSQL в облаке, бесплатный план).

### Локальная сеть (для магазина без интернета):
Платформа работает и в локальной сети — просто укажите IP вашего Mac в `NEXTAUTH_URL`.

---

*Платформа разработана для Таджикистана. Поддержка: русский и таджикский языки, валюта — сомони (TJS).*
