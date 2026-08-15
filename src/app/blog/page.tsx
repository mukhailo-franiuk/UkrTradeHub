import type { Metadata } from "next";
import BlogContent from "./BlogContent";

// СУПЕР МЕТАДАНІ ДЛЯ ІДЕАЛЬНОЇ ІНДЕКСУВАННЯ СТАТЕЙ БЛОГУ В GOOGLE
export const metadata: Metadata = {
  title: "Блог та корисні огляди гаджетів", // Перетвориться на "Блог та корисні огляди гаджетів | VelaMarket"
  description: "Експертні огляди техніки, електроніки та товарів для дому від команди VelaMarket. Корисні поради щодо вибору смартфонів, налаштування розумного дому, тренди дизайну інтер'єру та новинки технологій.",
  keywords: [
    "огляди смартфонів", 
    "поради щодо вибору техніки", 
    "новинки гаджетів", 
    "розумний дім налаштування", 
    "блог VelaMarket", 
    "тренди електроніки"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Технологічний блог VelaMarket — Огляди та тренди",
    description: "Читайте корисні статті та дізнавайтеся про найгарячіші новинки екосистеми гаджетів першими.",
    type: "article",
  },
};

export default function BlogPage() {
  return <BlogContent />;
}
