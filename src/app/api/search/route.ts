import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim() || query.length < 2) {
      return NextResponse.json([]);
    }

    // Текстовий пошук по базі даних Neon (case-insensitive)
    const products = await (prisma as any).product.findMany({
      where: {
        status: "APPROVED", // Шукаємо тільки активовані товари, що пройшли модерацію
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { brand: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        brand: true,
        slug: true,
        // ВИПРАВЛЕНО: Підтягуємо пов'язану модель зображень ProductImage
        images: {
          select: {
            imageUrl: true,
            isMain: true,
          },
        },
        // Отримуємо першу ліпшу варіацію лоту для розрахунку ціни
        variants: {
          take: 1,
          select: {
            id: true,
            price: true,
            oldPrice: true,
            stock: true,
          },
        },
      },
      take: 10, // Ліміт видачі для швидкості на мобільних пристроях
    });

    // Форматування масиву під уніфікований інтерфейс фронтенду
    const formattedProducts = products.map((p: any) => {
      // Безпечний доступ до першого елемента масиву варіацій
      const mainVariant = p.variants && p.variants.length > 0 
        ? p.variants[0] 
        : { id: p.id, price: 0, oldPrice: null, stock: 0 };
        
      const price = Number(mainVariant.price);
      const oldPrice = mainVariant.oldPrice ? Number(mainVariant.oldPrice) : price;
      
      const discount = oldPrice > price 
        ? Math.round(((oldPrice - price) / oldPrice) * 100) 
        : 0;

      // ВИПРАВЛЕНО: Шукаємо головне фото (isMain === true) або беремо просто перше з масиву
      let mainImageUrl = "";
      if (p.images && p.images.length > 0) {
        const mainImageObj = p.images.find((img: any) => img.isMain);
        mainImageUrl = mainImageObj ? mainImageObj.imageUrl : p.images[0].imageUrl;
      }

      return {
        id: mainVariant.id, // ID варіації (ProductVariant) як унікальний ключ для кошика
        productId: p.id,
        title: p.title,
        brand: p.brand,
        price: price,
        oldPrice: oldPrice,
        discount: discount,
        totalStock: mainVariant.stock,
        img: mainImageUrl, // Тепер сюди летить чисте посилання string із Vercel Blob CDN
        href: `/products/${p.slug}`,
      };
    });

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Критична помилка пошукового API-роуту:", error);
    return NextResponse.json({ error: "Внутрішня помилка сервера при зчитуванні бази Neon" }, { status: 500 });
  }
}



