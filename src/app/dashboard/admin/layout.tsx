import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Наш ізольований корпоративний сайдбар адміна */}
      <AdminSidebar />

      {/* 
        Контентна область адмінки.
        На мобільних пристроях додаємо верхній відступ (pt-16), щоб контент не перекривався фіксованим хедером.
        На десктопах зміщуємо контент вправо (lg:pl-[280px]), звільняючи місце під сайдбар шириною 280px.
      */}
      <div className="flex-1 pt-16 lg:pt-0 lg:pl-[280px] transition-all duration-300">
        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
