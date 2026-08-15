import { 
  Smartphone, Laptop, Home as HomeIcon, Shirt, 
  Sparkles, Dumbbell, Car, Gamepad2 
} from "lucide-react";

export const categories = [
  { name: "Електроніка", icon: Smartphone, href: "/electronics" },
  { name: "Телефони та аксесуари", icon: Smartphone, href: "/phones" },
  { name: "Комп'ютери та офіс", icon: Laptop, href: "/computers" },
  { name: "Дім, сад і ремонт", icon: HomeIcon, href: "/home-garden" },
  { name: "Одяг та взуття", icon: Shirt, href: "/clothing" },
  { name: "Краса та здоров'я", icon: Sparkles, href: "/beauty" },
  { name: "Спорт і відпочинок", icon: Dumbbell, href: "/sports" },
  { name: "Автотовари", icon: Car, href: "/auto" },
  { name: "Іграшки та хобі", icon: Gamepad2, href: "/toys" },
];

export const superDeals = [
  { 
    id: 1, 
    title: "Бездротові навушники VelaSound Pro Noise-Cancelling", 
    price: 289, 
    oldPrice: 599, 
    discount: 52, 
    totalStock: 500,
    soldCount: 367, 
    img: "🎧", 
    href: "/product/1" 
  },
  { 
    id: 2, 
    title: "Смарт-годинник VelaWatch Series 5 Active GPS", 
    price: 1499, 
    oldPrice: 2699, 
    discount: 45, 
    totalStock: 1500,
    soldCount: 1256, 
    img: "⌚", 
    href: "/product/2" 
  },
  { 
    id: 3, 
    title: "Смартфон VelaPhone 15 Pro 256GB Midnight", 
    price: 7699, 
    oldPrice: 19990, 
    discount: 62, 
    totalStock: 600,
    soldCount: 532, 
    img: "📱", 
    href: "/product/3" 
  },
  { 
    id: 4, 
    title: "Робот-пилосос VelaClean Bot Smart Home IQ", 
    price: 4899, 
    oldPrice: 6999, 
    discount: 30, 
    totalStock: 300,
    soldCount: 214, 
    img: "🧹", 
    href: "/product/4" 
  },
];

