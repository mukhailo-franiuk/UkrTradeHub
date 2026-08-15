import type { Metadata } from "next";
import DeliveryContent from "./DeliveryContent";

// СУПЕР МЕТАДАНІ ДЛЯ ІНДЕКСУВАННЯ СТОРІНКИ ДОСТАВКИ
export const metadata: Metadata = {
  title: "Доставка та оплата", // Автоматично перетвориться на "Доставка та оплата | VelaMarket" завдяки нашому шаблону в layout
  description: "Інформація про умови доставки та оплати на маркетплейсі VelaMarket. Швидка доставка Новою Поштою та Укрпоштою по всій Україні. Безпечна оплата онлайн, накладений платіж та розстрочка 0%.",
  keywords: ["доставка нова пошта", "укрпошта доставка", "оплата частинами монобанк", "накладений платіж комісія", "безпечна оплата карткою", "velamarket умови"],
  
  // Дозволяємо роботам індексувати цю сторінку
  robots: {
    index: true,
    follow: true,
  },

  // Налаштування Open Graph (для прев'ю в Telegram, Viber тощо)
  openGraph: {
    title: "Умови доставки та оплати замовлень | VelaMarket",
    description: "Надійна доставка Новою Поштою та Укрпоштою. Зручні методи оплати без прихованих комісій.",
    type: "article",
  },
};

export default function DeliveryPage() {
  return <DeliveryContent />;
}
