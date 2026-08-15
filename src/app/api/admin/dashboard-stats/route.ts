import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { ProductStatus } from "@prisma/client";

export async function GET() {
  try {
    // Паралельно виконуємо всі важкі агрегаційні запити до Neon для максимальної швидкості
    const [totalProducts, totalUsers, totalShops, moderationProducts] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.shop.count(),
      prisma.product.findMany({
        where: { status: ProductStatus.MODERATION },
        include: {
          shop: { select: { name: true } },
          category: { select: { name: true } },
          variants: { take: 1, select: { price: true, sku: true, stock: true } }
        },
        orderBy: { createdAt: "asc" } // Старі лоти показуємо першими, щоб швидше розгрібати чергу
      })
    ]);

    // Формуємо чистий JSON-об'єкт, який очікує наш клієнтський компонент
    const dashboardData = {
      stats: {
        totalProducts,
        totalUsers,
        totalShops,
        moderationCount: moderationProducts.length
      },
      queue: moderationProducts.map(p => ({
        id: p.id,
        title: p.title,
        brand: p.brand,
        description: p.description,
        shopName: p.shop.name,
        categoryName: p.category.name,
        price: p.variants[0]?.price ? Number(p.variants[0].price) : 0,
        sku: p.variants[0]?.sku || "Немає SKU",
        stock: p.variants[0]?.stock || 0,
        createdAt: p.createdAt.toISOString()
      }))
    };

    return NextResponse.json(dashboardData, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache"
      }
    });

  } catch (error: any) {
    console.error("🚨 КРИТИЧНИЙ ЗБІЙ API АДМІН-ПАНЕЛІ:", error.message);
    return NextResponse.json(
      { error: "Внутрішня помилка сервера при зборі статистики" }, 
      { status: 500 }
    );
  }
}
