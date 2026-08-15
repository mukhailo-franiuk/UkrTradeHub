import React from "react";
import { prisma } from "@/lib/prisma";
import { FolderTree, Sparkles } from "lucide-react";
import CategoriesClient from "./CategoriesClient";

export const revalidate = 0; // Дані завжди свіжі під час налаштування каталогу

async function getCategoriesData() {
  try {
    // Зчитуємо категорії через безпечний виклик
    // ТУТ БІЛЬШЕ НЕМАЄ НІЯКИХ ЗГАДОК ПРО imageBlob ЧИ КОНВЕРТАЦІЇ У BASE64
    const rawCategories = await (prisma as any)['category'].findMany({
      orderBy: [
        { parentId: "asc" }, // Спочатку виводяться батьківські, потім підкатегорії
        { name: "asc" }
      ],
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    // Повертаємо чисті дані з бази, де imageUrl — це вже готовий рядок-посилання на Vercel Blob
    return rawCategories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId || null,
      imageUrl: cat.imageUrl || null, // Використовуємо нове поле string замість imageBlob
      _count: cat._count
    }));
  } catch (error) {
    console.error("Помилка зчитування категорій з Neon PostgreSQL:", error);
    return [];
  }
}

export default async function AdminCategoriesDashboard() {
  const categories = await getCategoriesData();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 pb-20">
      
      {/* ШАПКА КАТЕГОРИЗАЦІЇ */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#0b0f19] border-b border-slate-800/60 py-10 mb-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-400/20 text-amber-400 rounded-full text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" /> Platform Taxonomy Engine
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <FolderTree className="w-8 h-8 text-amber-400" />
              Каталог Категорій <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Vela.Taxonomy</span>
            </h1>
            <p className="text-sm text-slate-400">Глобальне налаштування архітектури маркетплейсу з підтримкою вкладених деревоподібних підкатегорій та Vercel Blob CDN.</p>
          </div>
        </div>
      </div>

      {/* КЛІЄНТСЬКИЙ ІНТЕРФЕЙС КАТАЛОГУ СИСТЕМИ */}
      <div className="container mx-auto px-4 max-w-7xl">
        <CategoriesClient initialCategories={categories} />
      </div>
    </div>
  );
}

