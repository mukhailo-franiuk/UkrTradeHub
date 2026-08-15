import type { Metadata } from "next";
import RegisterContent from "./RegisterContent";

export const metadata: Metadata = {
  title: "Реєстрація особистого кабінету", // Автоматично доповниться до "Реєстрація особистого кабінету | VelaMarket" через layout
  description: "Створіть свій профіль на маркетплейсі VelaMarket. Швидка реєстрація через Google чи Telegram. Отримуйте 150 грн бонусу, відстежуйте замовлення та збирайте кешбек.",
  keywords: ["реєстрація", "створити акаунт", "зареєструватися VelaMarket", "новий профіль маркетплейс"],
  robots: {
    index: false, // Сторінки реєстрації зазвичай закривають від індексації пошуковими роботами
    follow: true,
  },
};

export default function RegisterPage() {
  return <RegisterContent />;
}
