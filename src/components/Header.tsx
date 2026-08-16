"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, Menu, Search, ShoppingCart, Heart, ChevronRight, Bell } from "lucide-react";
import { categories } from "@/config/marketplace";
import { useCartStore } from "@/store/useCartStore";
import Logo from "@/components/ui/Logo";
import UserMenu from "@/components/UserMenu";

const sidebarVariants: Variants = {
  open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
};

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  }, [cartItems]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Якщо ми перебуваємо на повноекранній сторінці мобільного пошуку, повністю вимикаємо хедер
  if (pathname === "/search-mobile") return null;

  return (
    <>
      {/* ВИПРАВЛЕНО: Прибрано overflow-hidden, щоб випадаюче UserMenu не зрізалося по краях хедера */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 w-full ${
          isScrolled
            ? "bg-[#0f172a]/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg py-2"
            : "bg-[#0f172a] dark:bg-slate-950 shadow-md py-3.5"
        } text-white`}
      >
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between gap-4">

          {/* ЛОГОТИП ТА КНОПКА БУРГЕРА — Завжди зліва */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="lg:hidden text-white hover:text-amber-400 transition-colors duration-200 cursor-pointer p-1.5 rounded-xl hover:bg-white/5"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Перемикач меню"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMobileMenuOpen ? "close" : "open"}
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            <Logo size="md" showText={true} />
          </div>

          {/* ДЕСКТОПНИЙ ПОШУК (Приховується на смартфонах) */}
          <div className="hidden md:flex flex-1 max-w-xl relative group z-10">
            <input
              type="text"
              placeholder="Я шукаю..."
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full pl-5 pr-12 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-amber-400 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 shadow-inner text-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-lg transition-all duration-200 flex items-center justify-center font-bold shadow-md cursor-pointer"
            >
              <Search size={16} />
            </motion.button>
          </div>

          {/* МОБІЛЬНА ЛУПА ПОШУКУ (Видно ТІЛЬКИ на смартфонах для швидкого переходу) */}
          <Link
            href="/search-mobile"
            className="md:hidden p-2.5 text-gray-300 hover:text-white rounded-xl bg-white/5 border border-white/10 transition-colors ml-auto"
          >
            <Search size={20} />
          </Link>

          {/* КОРИСТУВАЦЬКА ПАНЕЛЬ — ПОВНІСТЮ ПРИХОВАНО НА МОБІЛЬНИХ (hidden md:flex) */}
          <div className="hidden md:flex items-center gap-1 sm:gap-3 text-sm font-semibold flex-shrink-0">

            {/* Сповіщення */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-300 hover:text-amber-400 transition-colors relative cursor-pointer rounded-xl hover:bg-white/5"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 bg-rose-500 w-2 h-2 rounded-full animate-ping" />
            </motion.button>

            {/* Обране */}
            <Link href="/favorites" className="group p-2 text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 rounded-xl hover:bg-white/5">
              <motion.div whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }} transition={{ duration: 0.3 }}>
                <Heart size={20} className="group-hover:fill-amber-400/10" />
              </motion.div>
              <span className="hidden lg:inline text-white/90 group-hover:text-amber-400 transition-colors">Обране</span>
            </Link>

            {/* Кошик з живим стейтом */}
            <Link href="/cart" className="group p-2 text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 relative rounded-xl hover:bg-white/5">
              <motion.div whileHover={{ y: -3, scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <ShoppingCart size={20} />
              </motion.div>
              <span className="hidden lg:inline text-white/90 group-hover:text-amber-400 transition-colors">Кошик</span>

              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black font-mono shadow-md border border-[#0f172a]">
                  {cartCount}
                </span>
              )}
            </Link>

            <UserMenu />

          </div>
        </div>
      </header>

      {/* РОЗМИТТЯ ТЛІ ПРИ АКТИВНОМУ ПОШУКУ */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="hidden md:block fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* МОБІЛЬНЕ ВИЇЗНЕ МЕНЮ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 bottom-0 w-72 bg-[#0f172a] dark:bg-slate-900 z-50 p-5 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-5">
                  <Logo size="sm" showText={true} />
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">Категорії товарів</p>
                  {categories?.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="flex items-center justify-between text-sm font-semibold text-gray-300 hover:text-amber-400 transition-colors py-1"
                    >
                      {cat.name}
                      <ChevronRight size={14} className="text-gray-600" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="pt-5 border-t border-white/10 text-center text-[10px] font-mono text-gray-600">
                UkrTradeHub © {new Date().getFullYear()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
