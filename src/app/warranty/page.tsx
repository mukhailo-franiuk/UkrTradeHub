import type { Metadata } from "next";
import WarrantyContent from "./WarrantyContent";

export const metadata: Metadata = {
  title: "Гарантійні умови та сервіс",
  description: "Офіційні гарантійні умови на маркетплейсі VelaMarket. Терміни гарантії на техніку та електроніку, адреси сервісних центрів в Україні, правила гарантійного обслуговування та ремонту.",
  keywords: [
    "офіційна гарантія", 
    "гарантійне обслуговування техніка", 
    "сервісний центр україна", 
    "гарантійний талон", 
    "ремонт по гарантії", 
    "velamarket сервіс"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Офіційна гарантія та сервісна підтримка | VelaMarket",
    description: "Надаємо реальну гарантію на всі товари. Надійні авторизовані сервісні центри по всій Україні.",
    type: "article",
  },
};

export default function WarrantyPage() {
  return <WarrantyContent />;
}
