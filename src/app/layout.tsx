import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNavigation from "@/components/BottomNavigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// АДРЕСА ВАШОГО МАГАЗИНУ (Збережено для ідеального SEO та генерації OG-карт)
const SITE_URL = "https://ukrtradehub.com";

// СУПЕР МЕТАДАНІ ДЛЯ ІДЕАЛЬНОГО ІНДЕКСУВАННЯ В GOOGLE (SEO)
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  
  title: {
    default: "UkrTradeHub — Національний маркетплейс | Купити техніку, одяг та крафтові товари",
    template: "%s | UkrTradeHub", // Автоматично додаватиме бренд до внутрішніх сторінок
  },
  
  description: "Перший сучасний український маркетплейс, створений для підтримки локальних брендів, крафтовиків та виробників. Швидка доставка, безпечна оплата та гарантія якості.",
  keywords: ["маркетплейс", "інтернет магазин", "купити українське", "техніка", "електроніка", "крафт", "товари для дому", "UkrTradeHub", "акції", "знижки"],
  
  // Дозволяємо Google повністю індексувати сайт та переходити за посиланнями
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Канонічне посилання (запобігає дублям сторінок для Google)
  alternates: {
    canonical: "./",
  },

  // Протокол Open Graph (для прев'ю посилань у Telegram, Viber, Facebook)
  openGraph: {
    title: "UkrTradeHub — Національний маркетплейс",
    description: "Великий вибір сучасної техніки, електроніки та крафтових товарів від локальних виробників.",
    url: SITE_URL,
    siteName: "UkrTradeHub Ukraine",
    locale: "uk_UA",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Картинка 1200x630 у папці public/
        width: 1200,
        height: 630,
        alt: "UkrTradeHub — Простір вигідних та патріотичних покупок",
      },
    ],
  },

  // Картка для Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "UkrTradeHub — Національний маркетплейс",
    description: "Купуй товари українських виробників з вигодою та швидкою доставкою.",
    images: ["/og-image.jpg"],
  },

  // Інструменти верифікації власника сайту в пошукових системах
  verification: {
    google: "вставте_код_від_google_search_console_сюди", 
  },
  
  // Додаткові теги для мобільних браузерів та додатків
  category: "ecommerce",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Запобігає автоматичному зуму полів введення на iPhone
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground bg-[#070a13]">
        {/* Огортаємо AuthProvider-ом, щоб і хедер, і сторінки миттєво ділилися стейтом */}
        <AuthProvider>
          <Header />

          <div className="flex-1 flex flex-col pb-16 md:pb-0">
            {children}
          </div>

          <Footer />
          <BottomNavigation />
        </AuthProvider>
      </body>
    </html>
  );
}

