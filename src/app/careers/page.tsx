import type { Metadata } from "next";
import CareersContent from "./CareersContent";

export const metadata: Metadata = {
  title: "Вакансії та кар'єра", // Автоматично перетвориться на "Вакансії та кар'єра | VelaMarket"
  description: "Робота в VelaMarket. Приєднуйтесь до команди найкращого технологічного маркетплейсу в Україні. Актуальні вакансії у Києві та віддалено: IT, маркетинг, логістика, клієнтський сервіс та копірайтинг.",
  keywords: [
    "робота в інтернет магазині", 
    "вакансії маркетплейс", 
    "робота VelaMarket", 
    "вакансії IT віддалено україна", 
    "робота в підтримці клієнтів", 
    "кар'єра в екомерс"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Кар'єра у VelaMarket — Будуй майбутнє екомерсу разом з нами",
    description: "Шукаємо талановитих фахівців, які хочуть створювати преміальний сервіс та інноваційні продукти.",
    type: "article",
  },
};

export default function CareersPage() {
  return <CareersContent />;
}
