import type { Metadata } from "next";
import TermsContent from "./TermsContent";

export const metadata: Metadata = {
  title: "Угода користувача та правила сайту", // Автоматично перетвориться на "Угода користувача та правила сайту | VelaMarket"
  description: "Офіційна угода користувача маркетплейсу VelaMarket. Юридичні правила використання сайту, права та обов'язки покупців, умови замовлення техніки, електроніки та захист персональних даних.",
  keywords: [
    "угода користувача інтернет магазин", 
    "публічна оферта маркетплейс", 
    "правила сайту VelaMarket", 
    "права покупця екомерс", 
    "юридичні умови VelaMarket"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Угода користувача та публічна оферта | VelaMarket",
    description: "Юридичні правила використання платформи VelaMarket. Прозорі та захищені умови для кожного покупця.",
    type: "article",
  },
};

export default function TermsPage() {
  return <TermsContent />;
}
