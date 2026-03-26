// prisma/seed.ts — Tajikistan agricultural products

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Агро Центр Тоҷикистон...");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "fruits" }, update: {}, create: { nameRu: "Фрукты", nameTj: "Мева", slug: "fruits", sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: "vegetables" }, update: {}, create: { nameRu: "Овощи", nameTj: "Сабзавот", slug: "vegetables", sortOrder: 2 } }),
    prisma.category.upsert({ where: { slug: "dried-fruits" }, update: {}, create: { nameRu: "Сухофрукты", nameTj: "Мевахои хушк", slug: "dried-fruits", sortOrder: 3 } }),
    prisma.category.upsert({ where: { slug: "nuts" }, update: {}, create: { nameRu: "Орехи", nameTj: "Чормағз", slug: "nuts", sortOrder: 4 } }),
    prisma.category.upsert({ where: { slug: "herbs" }, update: {}, create: { nameRu: "Зелень", nameTj: "Кабудӣ", slug: "herbs", sortOrder: 5 } }),
  ]);

  const [fruits, vegetables, dried, nuts, herbs] = categories;
  console.log("✅ Категории созданы");

  const products = [
    {
      nameRu: "Помидоры Хатлон",
      nameTj: "Гӯҷабодиринги Хатлон",
      slug: "tomato-khatlon",
      descriptionRu: "Сочные, мясистые помидоры из плодородных долин Хатлонской области. Выращены под открытым небом без использования химических удобрений. Идеальны для консервации, приготовления соусов и свежего употребления. Насыщенный красный цвет и сладкий вкус.",
      descriptionTj: "Гӯҷабодирингҳои шарбатнок ва гӯштдор аз водиҳои ҳосилхези вилояти Хатлон. Дар фазои кушод бе нуриҳои кимиёвӣ парвариш ёфтааст. Барои консервакунӣ, тайёр кардани соусҳо ва истеъмоли тоза мувофиқ аст.",
      pricePerKg: 4.50, minimumOrder: 5, categoryId: fruits.id,
      originRegion: "Хатлон", stockQuantity: 8000, isFeatured: true, isOrganic: true,
      harvestSeason: "Июнь – Октябрь",
    },
    {
      nameRu: "Виноград Истаравшан",
      nameTj: "Ангури Истаравшан",
      slug: "grape-istaravshan",
      descriptionRu: "Столовый виноград высшего класса из исторического города Истаравшан. Известный своей особой сладостью и крупными ягодами. Сорта: Хусайне (Дамские пальчики), Кишмиш. Экспортное качество, популярен на рынках России и Казахстана.",
      descriptionTj: "Ангури суфраи дараҷаи аъло аз шаҳри таърихии Истаравшан. Бо ширинии хос ва донаҳои калони худ машҳур аст. Навъҳо: Ҳусайнӣ, Кишмиш. Сифати содиротӣ, дар бозорҳои Русия ва Қазоқистон маъмул аст.",
      pricePerKg: 12.00, minimumOrder: 3, categoryId: fruits.id,
      originRegion: "Согд", stockQuantity: 3500, isFeatured: true, isOrganic: false,
      harvestSeason: "Август – Октябрь",
    },
    {
      nameRu: "Абрикосы Исфара",
      nameTj: "Зардолуи Исфара",
      slug: "apricot-isfara",
      descriptionRu: "Золотистые абрикосы из садов Исфаринской долины. Таджикские абрикосы известны всему миру своим неповторимым ароматом и медовой сладостью. Содержат высокое количество каротина и витаминов. Применяются как в свежем виде, так и для производства кураги.",
      descriptionTj: "Зардолуҳои тиллоранг аз боғҳои водии Исфара. Зардолуи тоҷикӣ ба тамоми ҷаҳон бо бӯи беназир ва ширинии асалмонанди худ маълум аст. Миқдори зиёди каротин ва витаминҳо дорад.",
      pricePerKg: 8.50, minimumOrder: 3, categoryId: fruits.id,
      originRegion: "Согд", stockQuantity: 2000, isFeatured: true, isOrganic: true,
      harvestSeason: "Июнь – Июль",
    },
    {
      nameRu: "Лук репчатый",
      nameTj: "Пиёз",
      slug: "onion-tj",
      descriptionRu: "Крупный репчатый лук из Вахшской долины. Плотная шелуха, длительное хранение до 8 месяцев. Подходит для розничной и оптовой торговли. Один из основных экспортных продуктов Таджикистана.",
      descriptionTj: "Пиёзи калон аз водии Вахш. Пӯсти зич, нигоҳдории дарозмуддат то 8 моҳ. Барои савдои чаканагӣ ва яклухт мувофиқ аст. Яке аз маҳсулоти асосии содиротии Тоҷикистон.",
      pricePerKg: 2.20, minimumOrder: 20, categoryId: vegetables.id,
      originRegion: "РРП", stockQuantity: 15000, isFeatured: false, isOrganic: false,
      harvestSeason: "Июль – Сентябрь",
    },
    {
      nameRu: "Картофель горный",
      nameTj: "Картошкаи кӯҳӣ",
      slug: "potato-mountain",
      descriptionRu: "Рассыпчатый горный картофель с высокогорных полей ГБАО. Особый климат и чистая вода делают этот картофель необыкновенно вкусным. Содержание крахмала выше, чем у равнинных сортов. Любимый продукт таджикской кухни.",
      descriptionTj: "Картошкаи кӯҳии хӯбпазак аз замини баландкӯҳи ВМКБ. Иқлими хос ва оби тоза ин картошкаро бениҳоят лазиз мегардонанд.",
      pricePerKg: 3.80, minimumOrder: 10, categoryId: vegetables.id,
      originRegion: "ГБАО", stockQuantity: 6000, isFeatured: false, isOrganic: true,
      harvestSeason: "Август – Сентябрь",
    },
    {
      nameRu: "Курага (Исфара)",
      nameTj: "Қайси (Исфара)",
      slug: "dried-apricot-isfara",
      descriptionRu: "Натуральная курага без консервантов и красителей из Исфаринских садов. Сушка на солнце по традиционному методу сохраняет все витамины и ферменты. Золотисто-оранжевый цвет, насыщенный медово-кислый вкус. Популярна на мировых рынках.",
      descriptionTj: "Қайсии табиӣ бе консервантҳо ва рангҳо аз боғҳои Исфара. Хушконидан дар офтоб тибқи усули анъанавӣ ҳамаи витаминҳо ва ферментҳоро нигоҳ медорад.",
      pricePerKg: 28.00, minimumOrder: 2, categoryId: dried.id,
      originRegion: "Согд", stockQuantity: 1500, isFeatured: true, isOrganic: true,
      harvestSeason: "Переработка: июль–август",
    },
    {
      nameRu: "Грецкий орех",
      nameTj: "Чормағз",
      slug: "walnut-tj",
      descriptionRu: "Крупноплодный грецкий орех из горных садов Таджикистана. Тонкая скорлупа, высокий выход ядра (55–60%). Богат омега-3, идеален для кондитерских производств и прямой продажи. Урожай собирается вручную.",
      descriptionTj: "Чормағзи калондона аз боғҳои кӯҳии Тоҷикистон. Пӯсти тунук, баромади баланди магз (55–60%). Аз омега-3 бой аст, барои истеҳсолоти кандолотӣ ва фурӯши мустақим мувофиқ аст.",
      pricePerKg: 45.00, minimumOrder: 2, categoryId: nuts.id,
      originRegion: "Хатлон", stockQuantity: 2500, isFeatured: true, isOrganic: false,
      harvestSeason: "Сентябрь – Октябрь",
    },
    {
      nameRu: "Кориандр свежий",
      nameTj: "Гашнич (тоза)",
      slug: "coriander-fresh",
      descriptionRu: "Ароматный свежий кориандр (кинза) из тепличных хозяйств Душанбинского района. Срезается каждые 2–3 дня, всегда свежий. Незаменимая зелень таджикской кухни. Доставка в день среза.",
      descriptionTj: "Гашничи хушбӯи тоза аз хоҷагиҳои гармхонаи ноҳияи Душанбе. Ҳар 2–3 рӯз буррида мешавад, ҳамеша тоза. Кабудии ивазнашавандаи ошпазии тоҷикӣ.",
      pricePerKg: 15.00, minimumOrder: 1, categoryId: herbs.id,
      originRegion: "Душанбе", stockQuantity: 300, isFeatured: false, isOrganic: true,
      harvestSeason: "Круглый год",
    },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug }, update: {}, create: p,
    });
    await prisma.inventoryLog.upsert({
      where: { id: `seed-${product.id}` }, update: {},
      create: { id: `seed-${product.id}`, productId: product.id, change: p.stockQuantity, reason: "INITIAL", note: "Начальный склад" },
    });
  }

  console.log(`✅ Создано ${products.length} продуктов`);

  // Admin user
  await prisma.user.upsert({
    where: { email: "admin@agrocentr.tj" }, update: {},
    create: { email: "admin@agrocentr.tj", name: "Администратор", role: "ADMIN" },
  });

  console.log("✅ Создан admin: admin@agrocentr.tj");
  console.log("🎉 Начальные данные загружены!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
