import type { Metadata } from "next";
import CouponsContent from "./CouponsContent";

export const metadata: Metadata = {
  title: "Правила використання купонів та промокодів", // Автоматично перетвориться на "Правила використання купонів та промокодів | VelaMarket"
  description: "Офіційні правила використання акційних купонів, промокодів та дисконтних програм на маркетплейсі VelaMarket. Дізнайтеся, як активувати купон VELA150, які обмеження діють на товари та як отримати максимальну знижку.",
  keywords: [
    "як активувати промокод", 
    "купон на знижку інтернет магазин", 
    "промокод VelaMarket", 
    "знижка на перше замовлення", 
    "правила акцій VelaMarket",
    "VELA150 умови"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Правила використання купонів та промокодів | VelaMarket",
    description: "Прозорі умови активації знижок. Дізнайтеся, як заощаджувати більше на покупках у VelaMarket.",
    type: "article",
  },
};

export default function CouponsRulesPage() {
  return <CouponsContent />;
}
