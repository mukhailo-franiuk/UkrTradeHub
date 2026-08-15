import type { Metadata } from "next";
import ContactsContent from "./ContactsContent";

export const metadata: Metadata = {
  title: "Контакти та гаряча лінія підтримки",
  description: "Контактна інформація маркетплейсу VelaMarket. Номери телефонів гарячої лінії, адреса головного офісу в Києві, електронна пошта підтримки та форма зворотного зв'язку. Ми працюємо цілодобово 24/7.",
  keywords: [
    "контакти velamarket", 
    "гаряча лінія інтернет магазин", 
    "телефон підтримки маркетплейс", 
    "адреса офісу velamarket", 
    "написати в підтримку", 
    "електронна пошта магазину"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Контакти та цілодобова підтримка | VelaMarket",
    description: "Зв'яжіться з нами у будь-який зручний час. Адреса, телефони гарячої лінії та онлайн-форма підтримки.",
    type: "article",
  },
};

export default function ContactsPage() {
  return <ContactsContent />;
}
