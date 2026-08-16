import { prisma } from "@/lib/prisma";
import SidebarCategoriesContainer from "@/components/SidebarCategoriesContainer";
import HeroPromo from "@/components/sections/HeroPromo";
import Features from "@/components/sections/Features";
import SuperDeals from "@/components/sections/SuperDeals";
import BottomBanners from "@/components/sections/BottomBanners";

// Описуємо інтерфейс для категорії, щоб TypeScript не сварився
interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export default async function HomePage() {
  let realCategories: CategoryItem[] = [];
  
  try {
    // 1. Беремо перші три наявні категорії з Neon DB для перевірки їхніх реальних сліпків (slug)
    realCategories = await (prisma as any).category.findMany({
      take: 3, 
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true
      }
    });

    // 2. ДРУКУЄМО РЕАЛЬНІ СЛОГИ В КОНСОЛЬ VS CODE (ТЕРМІНАЛ) з явною типізацією
    console.log("=== [DEBUG] РЕАЛЬНІ КАТЕГОРІЇ З БАЗИ NEON ===");
    realCategories.forEach((cat: CategoryItem) => {
      console.log(`Назва: "${cat.name}" | РЕАЛЬНИЙ СЛОГ ДЛЯ МАСИВУ: "${cat.slug}"`);
    });
    console.log("============================================");

  } catch (error) {
    console.error("Помилка завантаження категорій:", error);
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl min-h-screen bg-[#070a13] text-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Ліве десктопне меню */}
        <SidebarCategoriesContainer /> 

        {/* Права інтерактивна контентна зона */}
        <div className="col-span-1 lg:col-span-3">
          <HeroPromo />
        </div>

      </div>

      {/* Горизонтальні блоки на всю ширину контейнера */}
      <Features />
      <SuperDeals />
      
      {/* Прокидаємо знайдені категорії в банери */}
      <BottomBanners realCategories={realCategories} />
    </main>
  );
}
