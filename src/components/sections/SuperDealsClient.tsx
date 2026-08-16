"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuth } from "@/context/AuthContext"; // Твій наявний контекст
import { toggleWishlistItem } from "@/app/favorites/actions";
import { ChevronRight, ShoppingCart, Heart, Flame, Check, AlertCircle } from "lucide-react";

interface DealItem {
  id: string;
  title: string;
  price: number;
  oldPrice: number;
  discount: number;
  soldCount: number;
  totalStock: number;
  img: string;
  href: string;
  slug: string;
}

interface SuperDealsClientProps {
  initialDeals: DealItem[];
}

export default function SuperDealsClient({ initialDeals }: SuperDealsClientProps) {
  const [deals, setDeals] = useState<DealItem[]>(initialDeals);
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 14, seconds: 45 });
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { user } = useAuth(); // Витягуємо користувача з твого AuthContext
  const addItemToCart = useCartStore((state) => state.addItem);
  const { items: wishlistItems, toggleItem: toggleWishlistStore } = useWishlistStore();

  // Зворотний відлік акції
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Ефект «живого покупця»
  useEffect(() => {
    const interval = setInterval(() => {
      setDeals((prev) =>
        prev.map((deal) => {
          if (Math.random() > 0.75 && deal.soldCount < deal.totalStock) {
            return { ...deal, soldCount: deal.soldCount + 1 };
          }
          return deal;
        })
      );
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleBuyClick = (product: DealItem) => {
    const availableStock = product.totalStock - product.soldCount;
    if (availableStock <= 0) return;

    addItemToCart({
      id: product.id,
      productId: product.id,
      title: product.title,
      brand: "SuperDeals",
      price: product.price,
      image: product.img,
      stock: product.totalStock,
      attributes: { promo: "Flash Sale" }
    });

    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedItems((prev) => ({ ...prev, [product.id]: false })), 1500);
  };

  const handleHeartClick = async (product: DealItem) => {
    // Якщо користувач не увійшов — показуємо гарний анімований тост
    if (!user || !user.id) {
      setErrorMessage("Будь ласка, увійдіть, щоб зберігати товари");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    // 1. Оптимістично додаємо/видаляємо в локальному стейті для миттєвого відгуку сердечка
    toggleWishlistStore({
      id: product.id,
      title: product.title,
      price: product.price,
      slug: product.slug || product.href.split("/").pop() || "",
      imageUrl: product.img,
    });

    // 2. Стріляємо в Neon DB, чітко передаючи user.id з нашого AuthContext
    const res = await toggleWishlistItem(product.id, user.id);

    if (!res.success) {
      setErrorMessage(res.error || "Помилка синхронізації");
      setTimeout(() => setErrorMessage(null), 3000);

      // Якщо база дала збій — відкочуємо сердечко назад
      toggleWishlistStore({
        id: product.id,
        title: product.title,
        price: product.price,
        slug: product.slug || product.href.split("/").pop() || "",
        imageUrl: product.img,
      });
    }
  };

  return (
    <section className="mt-12 bg-white dark:bg-[#0f172a] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800/60 relative">

      {/* Тост сповіщення */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-rose-400 font-bold text-xs"
          >
            <AlertCircle size={16} className="text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Шапка */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
            <Flame size={24} className="animate-pulse" />
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-gray-950 dark:text-white uppercase font-mono">
            SuperDeals
          </h2>
          <div className="flex items-center gap-1 font-mono text-xs font-bold text-white bg-rose-500 px-3 py-1.5 rounded-xl shadow-sm">
            <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
            <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
            <span className="w-4 inline-block text-center text-amber-300">{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>
        <Link href="/superdeals" className="text-sm font-bold text-indigo-600 dark:text-amber-400 hover:text-indigo-800 dark:hover:text-amber-300 flex items-center gap-1 group">
          Дивитися всі <ChevronRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Сітка товарів */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {deals.map((product) => {
          const fillPercentage = Math.min((product.soldCount / product.totalStock) * 100, 100);
          const isUrgent = fillPercentage > 85;
          const isUrlImage = product.img.startsWith("http") || product.img.startsWith("/");
          const isItemAdded = !!addedItems[product.id];
          const isOutOfStock = product.soldCount >= product.totalStock;
          const isLiked = wishlistItems.some((i) => i.id === product.id);

          return (
            <motion.div
              key={product.id}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="bg-gray-50 dark:bg-slate-950 p-3 md:p-4 rounded-2xl border border-gray-100 dark:border-slate-900/60 shadow-inner flex flex-col justify-between relative overflow-hidden group/card"
            >
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <span className="bg-rose-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-lg font-mono">
                  -{product.discount}%
                </span>
                <button
                  onClick={() => handleHeartClick(product)}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer backdrop-blur-md transition-all ${isLiked
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                      : "bg-white/80 dark:bg-slate-900/80 text-gray-400 hover:text-rose-500 border-gray-100 dark:border-slate-800"
                    }`}
                >
                  <Heart size={16} className={isLiked ? "fill-rose-500 text-rose-500" : ""} />
                </button>
              </div>

              <Link href={product.href} className="h-36 md:h-40 bg-white dark:bg-slate-900/40 rounded-xl flex items-center justify-center mb-3 shadow-sm relative overflow-hidden p-2">
                {isUrlImage ? (
                  <img src={product.img} alt={product.title} className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover/card:scale-110" />
                ) : (
                  <span className="text-5xl">{product.img}</span>
                )}
              </Link>

              <div className="flex-1 flex flex-col justify-between">
                <Link href={product.href} className="block">
                  <h3 className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2 min-h-[32px] md:min-h-[40px] hover:text-indigo-600 dark:hover:text-amber-400 transition-colors">
                    {product.title}
                  </h3>
                </Link>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-base md:text-lg font-black text-rose-500 font-mono">{product.price} ₴</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 line-through font-mono">{product.oldPrice} ₴</span>
                </div>

                {/* Динамічний прогрес-бар та лічильник залишку */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isUrgent ? "bg-gradient-to-r from-amber-500 to-rose-500" : "bg-gradient-to-r from-orange-500 to-rose-500"}`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[10px] font-bold mb-3">
                    <span className={isUrgent ? "text-rose-500 animate-pulse" : "text-gray-500 dark:text-gray-400"}>
                      {product.soldCount} продано
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">
                      з {product.totalStock}
                    </span>
                  </div>
                </div>

                {/* Кнопка дії — Оптимізована під кошик і типізацію Omit */}
                <button
                  disabled={isOutOfStock}
                  onClick={() => handleBuyClick(product)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all select-none cursor-pointer ${isOutOfStock
                      ? "bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      : isItemAdded
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10"
                        : "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-slate-950 shadow-sm"
                    }`}
                >
                  {isItemAdded ? (
                    <>
                      <Check size={14} />
                      В кошику
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={14} />
                      Купити
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

