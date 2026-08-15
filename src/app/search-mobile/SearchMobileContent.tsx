"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Search, ArrowLeft, X, ShoppingCart, Check, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function SearchMobileContent() {
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const addItemToCart = useCartStore((state) => state.addItem);

  // ЕФЕКТ ДЕБАУНСУ ДЛЯ ЖИВОГО ПОШУКУ З БАЗИ NEON
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setFilteredProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setFilteredProducts(data);
        }
      } catch (err) {
        console.error("Не вдалося виконати пошук:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleInstantBuy = (product: any, e: React.MouseEvent) => {
    e.preventDefault(); // Захищаємо кнопку від переходу по лінку всієї картки
    if (product.totalStock <= 0) return;

    addItemToCart({
      id: product.id,
      productId: product.productId,
      title: product.title,
      brand: product.brand,
      price: product.price,
      image: product.img,
      stock: product.totalStock,
      attributes: { source: "Live Search" }
    });

    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { type: "tween", ease: "easeOut", duration: 0.18 } }
  };

  return (
    <main className="container mx-auto px-4 py-4 max-w-md min-h-screen bg-[#070a13] text-slate-200 pb-24">
      
      {/* ВЕРХНЯ ПАНЕЛЬ: ПОШУКОВИЙ РЯДОК */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="p-3 text-slate-400 hover:text-white rounded-xl bg-[#111827]/60 border border-slate-800 shadow-sm cursor-pointer transition-colors">
          <ArrowLeft size={18} />
        </Link>
        
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            {isLoading ? <Loader2 size={16} className="animate-spin text-amber-400" /> : <Search size={16} />}
          </div>
          <input
            type="text"
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 text-sm rounded-xl bg-[#111827]/60 text-white border border-slate-800 focus:outline-none focus:border-amber-400/60 focus:ring-4 focus:ring-amber-400/5 transition-all font-medium shadow-sm placeholder-slate-500"
            placeholder="Введіть назву чи бренд..."
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {query.trim().length >= 2 && (
          /* РЕЗУЛЬТАТИ РЕАЛЬНОГО ПОШУКУ */
          <motion.div
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider pl-1 select-none font-mono">
              Знайдено в базі: <span className="text-amber-400">{filteredProducts.length}</span>
            </div>

            {filteredProducts.length === 0 && !isLoading ? (
              <div className="text-center py-12 text-xs font-medium text-slate-500 font-mono">
                Нічого не знайдено за цим запитом.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product) => {
                  const isItemAdded = !!addedItems[product.id];
                  const isOutOfStock = product.totalStock <= 0;

                  return (
                    <Link key={product.productId} href={product.href} className="block">
                      <motion.div
                        variants={itemVariants}
                        className="bg-[#111827]/40 border border-slate-800/80 p-3 rounded-2xl shadow-sm h-full flex flex-col justify-between relative group hover:border-slate-700/60 transition-colors"
                      >
                        {product.discount > 0 && (
                          <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md z-10 font-mono shadow-sm">
                            -{product.discount}%
                          </span>
                        )}
                        
                        {/* ЗОБРАЖЕННЯ ТОВАРУ */}
                        <div className="h-28 bg-slate-950/40 rounded-xl border border-slate-900/60 flex items-center justify-center p-2 mb-2.5 shadow-inner overflow-hidden">
                          {product.img && typeof product.img === "string" && product.img.trim() !== "" ? (
                            <img src={product.img} alt={product.title} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <span className="text-4xl">📦</span>
                          )}
                        </div>
                        
                        <div className="space-y-1 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xs font-bold text-slate-200 line-clamp-2 min-h-[32px] leading-tight group-hover:text-amber-400 transition-colors">
                              {product.title}
                            </h3>
                            <div className="flex flex-col mt-1">
                              <span className="text-sm font-black text-amber-400 font-mono tracking-tight">
                                {product.price.toLocaleString("uk-UA")} ₴
                              </span>
                              {product.discount > 0 && (
                                <span className="text-[10px] text-slate-500 line-through font-mono mt-0.5">
                                  {product.oldPrice.toLocaleString("uk-UA")} ₴
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-3">
                            <button
                              disabled={isOutOfStock}
                              onClick={(e) => handleInstantBuy(product, e)}
                              className={`w-full font-bold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                isOutOfStock
                                  ? "bg-slate-800 text-slate-500"
                                  : isItemAdded
                                  ? "bg-emerald-500 text-white"
                                  : "bg-amber-400 hover:bg-amber-500 text-slate-950"
                              }`}
                            >
                              {isOutOfStock ? (
                                "Немає"
                              ) : isItemAdded ? (
                                <>
                                  <Check size={12} /> Додано!
                                </>
                              ) : (
                                <>
                                  <ShoppingCart size={12} /> Купити
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
