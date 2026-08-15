import type { Metadata } from "next";
import LoginContent from "./LoginContent";

export const metadata: Metadata = {
  title: "Вхід в особистий кабінет", // Автоматично перетвориться на "Вхід в особистий кабінет | VelaMarket"
  description: "Увійдіть до свого особистого кабінету маркетплейсу VelaMarket, щоб відстежувати замовлення, отримувати кешбек, активувати купони та керувати списком обраних гаджетів.",
  keywords: ["авторизація", "вхід кабінет", "увійти VelaMarket", "особистий кабінет маркетплейс"],
  robots: {
    index: false, // Сторінки авторизації зазвичай приховують від індексації дублів, але ми додаємо метатеги для безпеки
    follow: true,
  },
};

export default function LoginPage() {
  return <LoginContent />;
}
