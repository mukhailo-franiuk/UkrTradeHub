import type { Metadata } from "next";
import SearchMobileContent from "./SearchMobileContent";

export const metadata: Metadata = {
  title: "Пошук товарів",
  description: "Зручний та швидкий мобільний пошук техніки, електроніки та товарів для дому на маркетплейсі VelaMarket.",
  robots: {
    index: false, // Сторінки внутрішнього мобільного пошуку зазвичай приховують від індексації Google
    follow: true,
  },
};

export default function SearchMobilePage() {
  return <SearchMobileContent />;
}
