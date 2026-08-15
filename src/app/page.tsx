import SidebarCategoriesContainer from "@/components/SidebarCategoriesContainer"; // 👈 Сайтиться суворо на серверний контейнер
import HeroPromo from "@/components/sections/HeroPromo";
import Features from "@/components/sections/Features";
import SuperDeals from "@/components/sections/SuperDeals";
import BottomBanners from "@/components/sections/BottomBanners";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl min-h-screen bg-[#070a13] text-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Ліве десктопне меню, куди серверний контейнер сам прокине пропс serverCategories */}
        <SidebarCategoriesContainer /> 

        {/* Права інтерактивна контентна зона */}
        <div className="col-span-1 lg:col-span-3">
          <HeroPromo />
        </div>

      </div>

      {/* Горизонтальні блоки на всю ширину контейнера */}
      <Features />
      <SuperDeals />
      <BottomBanners />
    </main>
  );
}
