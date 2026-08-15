import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetailsClient from "./ProductDetailsClient";

export const revalidate = 60; // Кешуємо на 1 хвилину для високої швидкості розробки

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 1. ДИНАМІЧНА ГЕНЕРАЦІЯ МЕТА-ТЕГІВ ДЛЯ SEO (ВИПРАВЛЕНО ТА ДОДАНО)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const product = await (prisma as any)['product'].findUnique({
      where: { slug, status: "APPROVED" },
      include: {
        images: { where: { isMain: true }, select: { imageUrl: true }, take: 1 }
      }
    });

    if (!product) {
      return {
        title: "Товар не знайдено | ",
        description: "Запитуваний лот відсутній або знаходиться на модерації."
      };
    }

    const mainImage = product.images[0]?.imageUrl || "";

    return {
      title: `${product.title} купити за найкращою ціною | `,
      description: product.description?.substring(0, 160) || `Купити оригінальний товар бренду ${product.brand} на UkrTradeHub з доставкою.`,
      openGraph: {
        title: product.title,
        description: product.description?.substring(0, 160),
        images: mainImage ? [{ url: mainImage }] : [],
        type: "article"
      },
      twitter: {
        card: "summary_large_image",
        title: product.title,
        description: product.description?.substring(0, 160),
        images: mainImage ? [mainImage] : []
      }
    };
  } catch (error) {
    return {
      title: "Картка товару | "
    };
  }
}

// Допоміжна функція отримання повних даних лоту
async function getProductBySlug(slug: string) {
  try {
    const product = await (prisma as any)['product'].findUnique({
      where: { slug, status: "APPROVED" },
      include: {
        shop: { select: { name: true, slug: true } },
        images: { orderBy: { isMain: "desc" }, select: { imageUrl: true, isMain: true } },
        variants: { select: { id: true, price: true, oldPrice: true, stock: true, attributes: true } },
        category: { select: { name: true } }
      }
    });

    if (!product) return null;

    const formattedVariants = product.variants.map((v: any) => ({
      id: v.id,
      price: Number(v.price),
      oldPrice: v.oldPrice ? Number(v.oldPrice) : null,
      stock: Number(v.stock),
      attributes: v.attributes || {}
    }));

    return {
      id: product.id,
      title: product.title,
      brand: product.brand,
      description: product.description,
      categoryName: product.category?.name || "Каталог",
      shopName: product.shop?.name || "Vela Vendor",
      images: product.images.map((img: any) => img.imageUrl),
      variants: formattedVariants
    };
  } catch (error) {
    console.error("Помилка завантаження сторінки товару:", error);
    return null;
  }
}

// 2. ГОЛОВНИЙ РЕНДЕР СТОРІНКИ
export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound(); 
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] pt-6 pb-24 text-gray-900 dark:text-slate-200">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* ХЛІБНІ КРИХТИ (BREADCRUMBS) */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 mb-6 font-medium">
          <span>Головна</span>
          <span>/</span>
          <span>{product.categoryName}</span>
          <span>/</span>
          <span className="text-gray-900 dark:text-amber-400 truncate max-w-[200px] font-bold">{product.title}</span>
        </div>

        {/* ГОЛОВНИЙ КЛІЄНТСЬКИЙ ІНТЕРФЕЙС */}
        <ProductDetailsClient product={product} />

      </div>
    </main>
  );
}
