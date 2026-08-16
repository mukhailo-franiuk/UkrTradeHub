"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/store/useCartStore";
import { Home, Heart, ShoppingCart, User, Search } from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  href: string;
  dynamic?: boolean;
  isCart?: boolean;
}

// Компонент кошика з реактивним лічильником із Zustand
function AppShoppingCart({ className, size = 22 }: { className?: string; size?: number }) {
  const cartItems = useCartStore((state) => state.items);
  const [cartCount, setCartCount] = useState(0);

  // Безпечний перерахунок кількості на стороні клієнта для уникнення Hydration Error
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  }, [cartItems]);

  return (
    <div className="relative">
      <ShoppingCart className={className} size={size} />
      {cartCount > 0 && (
        <motion.span 
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
          className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black font-mono shadow-sm border border-white dark:border-slate-900"
        >
          {cartCount}
        </motion.span>
      )}
    </div>
  );
}

const baseNavItems: NavItem[] = [
  { label: "Головна", icon: Home, href: "/" },
  { label: "Пошук", icon: Search, href: "/search-mobile" },
  { label: "Кошик", icon: AppShoppingCart, href: "/cart", isCart: true },
  { label: "Обране", icon: Heart, href: "/favorites" },
  { label: "Кабінет", icon: User, href: "/login", dynamic: true },
];

const tabBgTransition = { type: "tween", ease: "easeOut", duration: 0.2 } as const;
const iconTransition = { type: "tween", ease: "easeInOut", duration: 0.15 } as const;

export default function BottomNavigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Обчислюємо динамічний шлях для кабінету на основі ролі користувача
  const getProfileHref = () => {
    if (!user) return "/login";
    
    const role = String(user.role).toUpperCase();
    if (role === "ADMIN") return "/dashboard/admin";
    if (role === "VENDOR") return "/dashboard/vendor";
    if (role === "BUYER") return "/dashboard/buyer";
    
    return "/login";
  };

  const currentNavItems = baseNavItems.map(item => {
    if (item.dynamic) {
      return { ...item, href: getProfileHref() };
    }
    return item;
  });

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-100 dark:border-slate-800/60 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-3">
        {currentNavItems.map((item) => {
          const Icon = item.icon;
          
          // Розумна підсвітка активного стану, враховуючи динамічні підсторінки кабінетів
          const isActive = item.dynamic 
            ? pathname === item.href || (item.href !== "/login" && pathname?.startsWith(item.href))
            : item.isCart 
            ? pathname === item.href
            : pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-14 h-full text-center group cursor-pointer"
            >
              {/* Анімований плаваючий фон вкладки */}
              {isActive && (
                <motion.span
                  layoutId="activeTabBg"
                  transition={tabBgTransition}
                  className="absolute inset-x-0.5 inset-y-1.5 bg-amber-500/10 dark:bg-amber-400/10 rounded-xl"
                />
              )}

              {/* Контейнер іконки */}
              <motion.div
                whileTap={{ scale: 0.92 }}
                animate={isActive ? { y: -1, scale: 1.02 } : { y: 0, scale: 1 }}
                transition={iconTransition}
                className={`${
                  isActive
                    ? "text-amber-500 dark:text-amber-400"
                    : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                }`}
              >
                <Icon size={22} />
              </motion.div>

              {/* Текстовий підпис */}
              <span
                className={`text-[10px] mt-1 font-bold tracking-tight transition-colors duration-200 ${
                  isActive
                    ? "text-amber-500 dark:text-amber-400 font-black"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
