import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CatalogClient from "./CatalogClient";

interface CatalogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CatalogPage({ params }: CatalogPageProps) {
  const { slug } = await params;

  // 1. Завантажуємо категорію, підкатегорії та товари з урахуванням твоїх моделей
  const category = await (prisma as any).category.findUnique({
    where: { slug },
    include: {
      subChapters: {
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
        },
      },
      products: {
        include: {
          // Завантажуємо галерею картинок
          images: {
            select: { imageUrl: true, isMain: true },
          },
          // Завантажуємо всі варіації для прорахунку цін
          variants: {
            select: { price: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) {
    notFound();
  }

  // 2. Безпечне формування масиву товарів для клієнтського компонента
  const formattedProducts = (category.products || []).map((product: any) => {
    // Шукаємо головне фото (де isMain: true). Якщо такого немає — беремо перше ліпше
    const mainImageObj = product.images?.find((img: any) => img.isMain) || product.images?.[0];
    const firstImg = mainImageObj?.imageUrl || "";
    
    // Збираємо всі ціни з наявних варіантів товарів
    const variantPrices = (product.variants || []).map((v: any) => Number(v.price) || 0);
    
    // Знаходимо мінімальну ціну серед усіх варіантів. Якщо варіантів немає — ставимо 0
    const minPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : 0;

    return {
      id: product.id,
      title: product.title || "Без назви",
      price: minPrice, // Передаємо чисте валідне число на клієнт
      slug: product.slug || "",
      imageUrl: firstImg,
    };
  });

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl min-h-screen bg-[#070a13] text-slate-200 pb-24">
      
      {/* 🗺️ КРИХТИ ХЛІБА */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6 overflow-x-auto whitespace-nowrap py-1">
        <Link href="/" className="hover:text-amber-400 transition-colors">Головна</Link>
        <ChevronRight size={12} className="shrink-0" />
        <span className="text-slate-300 font-bold">{category.name}</span>
      </nav>

      {/* 🏷️ ШАПКА КАТЕГОРІЇ */}
      <div className="mb-6 pb-4 border-b border-slate-900">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase font-sans">
          {category.name}
        </h1>
      </div>

      {/* 🗂️ ПІДКАТЕГОРІЇ */}
      {category.subChapters && category.subChapters.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-black tracking-wider text-slate-400 uppercase font-mono mb-4">
            Підкатегорії
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {category.subChapters.map((sub: any) => (
              <Link
                key={sub.id}
                href={`/catalog/${sub.slug}`}
                className="bg-[#111827]/40 border border-slate-800/60 hover:border-amber-400/40 p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-2 group transition-all"
              >
                <div className="w-12 h-12 bg-slate-950 rounded-xl border border-slate-900 flex items-center justify-center overflow-hidden p-1">
                  {sub.imageUrl ? (
                    <img src={sub.imageUrl} alt={sub.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                  ) : (
                    <span className="text-xl">📁</span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-300 group-hover:text-amber-400 line-clamp-1 transition-colors">
                  {sub.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 🛍️ ІНТЕРАКТИВНА СІТКА ТОВАРІВ */}
      <CatalogClient initialProducts={formattedProducts} />

    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const category = await (prisma as any).category.findUnique({
      where: { slug },
      select: { name: true }
    });
    if (!category) return { title: "Категорію не знайдено" };
    return { title: `${category.name} | UkrTradeHub` };
  } catch (error) {
    return { title: "Каталог товарів" };
  }
}
