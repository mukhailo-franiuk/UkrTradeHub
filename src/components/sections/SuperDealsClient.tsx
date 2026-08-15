"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore"; // Підключаємо наш Zustand кошик
import { ChevronRight, ShoppingCart, Heart, Flame, Check } from "lucide-react";

interface DealItem {
  id: string; // Строкові ID з бази даних Neon (ProductVariant ID або Product ID)
  title: string;
  price: number;
  oldPrice: number;
  discount: number;
  soldCount: number;
  totalStock: number;
  img: string;
  href: string;
}

interface SuperDealsClientProps {
  initialDeals: DealItem[];
}

export default function SuperDealsClient({ initialDeals }: SuperDealsClientProps) {
  const [deals, setDeals] = useState<DealItem[]>(initialDeals);
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 14, seconds: 45 });
  
  // Об'єкт для відстеження стану додавання окремо для кожної картки (без глобального рендеру)
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  // Екшен додавання товарів до глобального сховища Zustand
  const addItemToCart = useCartStore((state) => state.addItem);

  // 1. Зворотний відлік акції
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

  // 2. Ефект «живого покупця» на платформі
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

  // Сучасний обробник покупки без alert()
  const handleBuyClick = (product: DealItem) => {
    const availableStock = product.totalStock - product.soldCount;
    if (availableStock <= 0) return;

    // Записуємо товар до Zustand (зберігається в localStorage)
    addItemToCart({
      id: product.id, // Використовуємо ID як унікальний ключ варіації лоту
      productId: product.id,
      title: product.title,
      brand: "SuperDeals",
      price: product.price,
      image: product.img,
      stock: product.totalStock,
      attributes: { promo: "Flash Sale" }
    });

    // Вмикаємо локальну анімацію успіху на конкретній кнопці
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    
    // Повертаємо початковий стан кнопки через 1.5 секунди
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section className="mt-12 bg-white dark:bg-[#0f172a] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800/60">
      
      {/* ШАПКА СЕКЦІЇ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
            <Flame size={24} className="animate-pulse" />
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-gray-950 dark:text-white uppercase font-mono">
            SuperDeals
          </h2>
          
          <div className="flex items-center gap-1 font-mono text-xs font-bold text-white bg-rose-500 px-3 py-1.5 rounded-xl shadow-sm">
            <span className="text-[10px] uppercase font-sans tracking-wider mr-1 opacity-90 hidden sm:inline">До кінця:</span>
            <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
            <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
            <span className="w-4 inline-block text-center text-amber-300">{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>
        
        <Link href="/superdeals" className="text-sm font-bold text-indigo-600 dark:text-amber-400 hover:text-indigo-800 dark:hover:text-amber-300 flex items-center gap-1 group">
          Дивитися всі <ChevronRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* СІТКА РЕАЛЬНИХ ТОВАРІВ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {deals.map((product) => {
          const fillPercentage = Math.min((product.soldCount / product.totalStock) * 100, 100);
          const isUrgent = fillPercentage > 85;
          const isUrlImage = product.img.startsWith("http") || product.img.startsWith("/");
          const isItemAdded = !!addedItems[product.id]; // Дізнаємося поточний стан цієї картки
          const isOutOfStock = product.soldCount >= product.totalStock;

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
                <button className="w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-gray-400 hover:text-rose-500 border border-gray-100 dark:border-slate-800 flex items-center justify-center cursor-pointer">
                  <Heart size={16} />
                </button>
              </div>

              {/* Зображення з Vercel Blob */}
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

                {/* Динамічний прогрес-бар складу */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isUrgent ? "bg-gradient-to-r from-amber-500 to-rose-500" : "bg-gradient-to-r from-orange-500 to-rose-500"}`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[10px] font-bold">
                    <span className={isUrgent ? "text-rose-500 animate-pulse" : "text-gray-500 dark:text-gray-400"}>{product.soldCount} продано</span>
                    <span className="text-gray-400 dark:text-gray-500 font-medium">Залишок: {product.totalStock - product.soldCount} шт</span>
                  </div>
                </div>
              </div>

              {/* СУЧАСНА МОДИФІКОВАНА КНОПКА ДОДАННЯ З ЛОКАЛЬНИМ ФІДБЕКОМ */}
              <div className="mt-4">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  disabled={isOutOfStock}
                  onClick={() => handleBuyClick(product)}
                  className={`w-full font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    isOutOfStock
                      ? "bg-gray-200 dark:bg-slate-800 text-gray-400"
                      : isItemAdded
                      ? "bg-emerald-500 text-white shadow-emerald-500/20"
                      : "bg-indigo-600 dark:bg-slate-800 hover:bg-indigo-700 dark:hover:bg-slate-700 text-white"
                  }`}
                >
                  {isItemAdded ? <Check size={14} /> : <ShoppingCart size={14} />} 
                  {isOutOfStock ? "Розпродано" : isItemAdded ? "Додано!" : "Купити"}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
