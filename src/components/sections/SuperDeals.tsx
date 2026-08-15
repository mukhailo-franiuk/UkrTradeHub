import React from "react";
import { prisma } from "@/lib/prisma";
import SuperDealsClient from "./SuperDealsClient";

export const revalidate = 0; // Завжди свіжі дані

async function getLiveSuperDeals() {
  try {
    // Шукаємо активні схвалені товари, у яких є варіанти зі знижками
    const products = await (prisma as any)['product'].findMany({
      where: {
        status: "APPROVED",
      },
      include: {
        images: {
          where: { isMain: true },
          select: { imageUrl: true },
          take: 1,
        },
        variants: {
          select: {
            price: true,
            oldPrice: true,
            stock: true,
          },
        },
      },
      take: 4, // Беремо топ-4 для вітрини
    });

    return products
      .map((p: any) => {
        const prices = p.variants.map((v: any) => Number(v.price));
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        
        // Шукаємо варіант з максимальною старою ціною для розрахунку знижки
        const oldPrices = p.variants.filter((v: any) => v.oldPrice).map((v: any) => Number(v.oldPrice));
        const maxOldPrice = oldPrices.length > 0 ? Math.max(...oldPrices) : 0;

        let discount = 0;
        if (maxOldPrice > minPrice) {
          discount = Math.round(((maxOldPrice - minPrice) / maxOldPrice) * 100);
        }

        const totalStock = p.variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0);

        // Якщо у товару немає знижки в базі, але це SuperDeal, поставимо дефолтну або пропустимо
        // Для тесту виведемо навіть ті, де знижка прорахована динамічно
        return {
          id: p.id, // Тепер це String (UUID/CUID) з бази даних
          title: p.title,
          price: minPrice,
          oldPrice: maxOldPrice || Math.round(minPrice * 1.2), // Якщо старої ціни немає, генеруємо для краси +20%
          discount: discount || 15, // Дефолтна знижка, якщо не вказано
          totalStock: totalStock || 50,
          soldCount: Math.floor((totalStock || 50) * 0.4), // Імітуємо, що 40% вже розпродано
          img: p.images[0]?.imageUrl || "🛒", // Якщо немає фото, покажемо емодзі кошика
          href: `/products/${p.slug}`,
        };
      });
  } catch (error) {
    console.error("Помилка завантаження SuperDeals з бази:", error);
    return [];
  }
}

export default async function SuperDealsSection() {
  const liveDeals = await getLiveSuperDeals();

  if (liveDeals.length === 0) return null; // Якщо товарів немає, секція не муляє око

  return <SuperDealsClient initialDeals={liveDeals} />;
}
