import React from "react";
import { prisma } from "@/lib/prisma";
import { ShoppingBag, Sparkles } from "lucide-react";
import ProductsModernizationClient from "./ProductsModernizationClient";

export const revalidate = 0;

async function getAdminProductsData() {
  try {
    const products = await (prisma as any)['product'].findMany({
      orderBy: { createdAt: "desc" },
      include: {
        shop: { select: { name: true } },
        images: { 
          where: { isMain: true }, 
          select: { imageUrl: true }, // ВИПРАВЛЕНО: Використовуємо реальне поле imageUrl з вашої схеми
          take: 1 
        },
        variants: { select: { price: true, oldPrice: true, stock: true } }
      }
    });

    return products.map((p: any) => {
      const prices = p.variants.map((v: any) => Number(v.price));
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const totalStock = p.variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0);
      const discounts = p.variants
        .filter((v: any) => v.oldPrice && Number(v.oldPrice) > Number(v.price))
        .map((v: any) => Math.round(((Number(v.oldPrice) - Number(v.price)) / Number(v.oldPrice)) * 100));
      
      return {
        id: p.id,
        title: p.title,
        brand: p.brand,
        status: p.status,
        isHotDeal: p.isHotDeal,
        isFeatured: p.isFeatured,
        shopName: p.shop?.name || "Вендор платформи",
        mainImageUrl: p.images[0]?.imageUrl || null, // ВИПРАВЛЕНО: Коректно зчитуємо imageUrl з першого об'єкта масиву images
        price: minPrice,
        discount: discounts.length > 0 ? Math.max(...discounts) : 0,
        stock: totalStock
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Допоміжна функція зчитування категорій для модалки створення
async function getCategoriesList() {
  try {
    return await (prisma as any)['category'].findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true }
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await getAdminProductsData();
  const categories = await getCategoriesList(); 

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 pb-20">
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#0b0f19] border-b border-slate-800/60 py-10 mb-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-400/20 text-amber-400 rounded-full text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" /> Platform Inventory Control
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-amber-400" />
              Модерація Товарів <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Vela.Inventory</span>
            </h1>
            <p className="text-sm text-slate-400">Глобальний контроль асортименту, верифікація мультиваріативних карток лотів від вендорів та інструменти адмін-публікацій.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <ProductsModernizationClient initialProducts={products} categories={categories} />
      </div>
    </div>
  );
}
