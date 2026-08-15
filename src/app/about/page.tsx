import type { Metadata } from "next";
import AboutContent from "./AboutContent";

// СУПЕР МЕТАДАНІ ДЛЯ ІНДЕКСУВАННЯ СТОРІНКИ "ПРО КОМПАНІЮ"
export const metadata: Metadata = {
  title: "Про компанію VelaMarket", // Перетвориться на "Про компанію VelaMarket | VelaMarket"
  description: "Дізнайтеся більше про VelaMarket — технологічний маркетплейс майбутнього. Наша місія, цінності, історія розвитку, ключові цифри бренду та переваги для покупців електроніки, техніки та товарів для дому в Україні.",
  keywords: [
    "про компанію velamarket", 
    "інтернет магазин україна", 
    "маркетплейс електроніки", 
    "надійний магазин техніки", 
    "velamarket цінності", 
    "команда velamarket"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Про VelaMarket — Простір вигідних та безпечних покупок",
    description: "Будуємо екосистему для зручного шопінгу в Україні з офіційною гарантією та європейським сервісом.",
    type: "article",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
