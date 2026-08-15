"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, Menu, Search, ShoppingCart, Heart, ChevronRight, Bell } from "lucide-react";
import { categories } from "@/config/marketplace";
import { useCartStore } from "@/store/useCartStore"; // Імпортуємо наш Zustand-кошик
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

  // Підключаємо динамічний лічильник товарів із кошика
  // НОВИЙ ВИПРАВЛЕНИЙ КОД
const cartItems = useCartStore((state) => state.items);
const [cartCount, setCartCount] = useState(0);

// Щоразу, як масив товарів у кошику змінюється, лічильник моментально перераховується
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-[#0f172a]/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg py-2"
          : "bg-[#0f172a] dark:bg-slate-950 shadow-md py-3.5"
          } text-white`}
      >
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between gap-4">

          {/* ЛОГОТИП ТА КНОПКА БУРГЕРА */}
          <div className="flex items-center gap-4">
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

            <Logo size="md" />
          </div>

          {/* ДЕСКТОПНИЙ ПОШУК */}
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

          {/* КОРИСТУВАЦЬКА ПАНЕЛЬ */}
          <div className="flex items-center gap-1 sm:gap-3 text-sm font-semibold">

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

        {/* МАРШРУТ ПОШУКУ ДЛЯ СМАРТФОНІВ */}
        <div className="md:hidden px-4 pb-3.5 pt-1">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Я шукаю..."
              className="w-full pl-5 pr-12 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 focus:outline-none transition-all duration-300 text-sm"
            />
            <button className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-amber-400 text-slate-900 rounded-lg flex items-center justify-center cursor-pointer font-bold">
              <Search size={16} />
            </button>
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
              className="fixed top-0 left-0 bottom-0 w-80 bg-slate-900 text-white z-50 p-6 flex flex-col justify-between shadow-2xl lg:hidden border-r border-slate-800"
            >
              <div className="space-y-6 overflow-y-auto h-full pr-2">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <Logo size="sm" />
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* СПИСОК КАТЕГОРІЙ */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono pl-2 mb-2">Категорії товарів</p>
                  <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-1">
                    {categories?.map((category: any) => (
                      <motion.div key={category.id} variants={itemVariants}>
                        <Link
                          href={`/catalog/${category.slug}`}
                          className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-amber-400 font-medium rounded-xl hover:bg-white/5 transition-colors group"
                        >
                                                    <span className="flex items-center gap-2.5">
                            <span>{category.icon || "📦"}</span>
                            {category.name}
                          </span>
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5 transition-all text-amber-400" />
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Мобільний футер меню */}
              <div className="border-t border-slate-800 pt-4 mt-auto text-xs text-gray-500 font-medium font-mono text-center">
                Vela Marketplace v1.2.0
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}


