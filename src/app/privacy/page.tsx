import type { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Політика конфіденційності та захисту даних", // Автоматично перетвориться на "Політика конфіденційності та захисту даних | VelaMarket"
  description: "Політика конфіденційності маркетплейсу VelaMarket. Дізнайтеся, як ми збираємо, обробляємо та надійно захищаємо ваші персональні дані, файли cookies та платіжну інформацію відповідно до стандартів GDPR та PCI-DSS.",
  keywords: [
    "політика конфіденційності інтернет магазин", 
    "захист персональних даних україна", 
    "файли cookies налаштування", 
    "безпека платежів маркетплейс", 
    "GDPR VelaMarket",
    "конфіденційність VelaMarket"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Політика конфіденційності та захисту даних | VelaMarket",
    description: "Ваша безпека — наш пріоритет. Дізнайтеся, як ми захищаємо ваші персональні дані за міжнародними стандартами.",
    type: "article",
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
