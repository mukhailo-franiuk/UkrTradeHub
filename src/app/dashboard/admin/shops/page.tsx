import React from "react";
import { prisma } from "@/lib/prisma";
import { Store, Sparkles } from "lucide-react";
import ShopGrid from "./ShopGrid";

export const revalidate = 0;

async function getShopsData() {
  try {
    const rawShops = await prisma.shop.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    return rawShops.map(shop => {
      // Приводимо до рядка, щоб обійти жорстку перевірку типів і виключити помилку overlap
      const currentStatus = String(shop.status);

      // Магазин активний, якщо він не в очікуванні (PENDING) і не заблокований (SUSPENDED)
      const isApproved = currentStatus !== "PENDING" && currentStatus !== "SUSPENDED";

      return {
        id: shop.id,
        name: shop.name || "Новий маркет",
        description: shop.description,
        isApproved: isApproved, // Передаємо булеве значення для ShopGrid
        createdAt: shop.createdAt.toLocaleDateString("uk-UA", {
          day: "numeric",
          month: "short",
          year: "numeric"
        }),
        _count: {
          products: shop._count.products
        }
      };
    });
  } catch (error) {
    console.error("Помилка завантаження бази магазинів платформи:", error);
    return [];
  }
}

export default async function AdminShopsDashboard() {
  const shops = await getShopsData();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 pb-20">
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#0b0f19] border-b border-slate-800/60 py-10 mb-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-400/20 text-amber-400 rounded-full text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" /> Vendor Hub Management
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Store className="w-8 h-8 text-amber-400" />
              Керування Магазинами <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Vela.Shops</span>
            </h1>
            <p className="text-sm text-slate-400">Контроль торгових точок вендорів, активація ліцензій продажів та миттєве блокування за порушення правил.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <ShopGrid initialShops={shops} />
      </div>
    </div>
  );
}
