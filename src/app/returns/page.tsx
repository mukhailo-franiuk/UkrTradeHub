import type { Metadata } from "next";
import ReturnsContent from "./ReturnsContent";

export const metadata: Metadata = {
  title: "Обмін та повернення товарів",
  description: "Правила та умови обміну та повернення товарів на маркетплейсі VelaMarket. Як повернути товар протягом 14 днів, які документи потрібні та як швидко повертаються гроші на картку.",
  keywords: [
    "повернення товару 14 днів", 
    "закон про захист прав споживачів", 
    "як повернути товар", 
    "обмін техніки", 
    "гарантія повернення грошей", 
    "velamarket повернення"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Легкий обмін та повернення товарів | VelaMarket",
    description: "Прості та прозорі умови повернення покупок. Повертаємо кошти на картку без зайвої бюрократії.",
    type: "article",
  },
};

export default function ReturnsPage() {
  return <ReturnsContent />;
}
