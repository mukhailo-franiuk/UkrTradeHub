import type { Metadata } from "next";
import FaqContent from "./FaqContent";

export const metadata: Metadata = {
  title: "Часті запитання (FAQ)",
  description: "Відповіді на найпопулярніші запитання покупців маркетплейсу VelaMarket. Дізнайтеся більше про оформлення замовлення, терміни доставки, способи оплати, повернення коштів та гарантійні зобов'язання.",
  keywords: [
    "FAQ інтернет магазин", 
    "часті запитання", 
    "як скасувати замовлення", 
    "коли повернуться гроші", 
    "velamarket підтримка", 
    "доставка по україні питання"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Часті запитання (FAQ) та підтримка клієнтів | VelaMarket",
    description: "Знайдіть відповіді на всі запитання щодо покупок, оплати та доставки в одному місці.",
    type: "article",
  },
};

export default function FaqPage() {
  return <FaqContent />;
}
