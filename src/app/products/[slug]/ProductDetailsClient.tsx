"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Store, CheckCircle, AlertTriangle, Check } from "lucide-react";

interface Variant {
  id: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  attributes: Record<string, any>;
}

interface ProductDetailsProps {
  product: {
    id: string;
    title: string;
    brand: string;
    description: string;
    shopName: string;
    images: string[];
    variants: Variant[];
  };
}

export default function ProductDetailsClient({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0]);
  const [activeImage, setActiveImage] = useState<string>(product.images[0] || "🛒");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false); // Сучасний стейт для фідбеку кнопки

  const addItemToCart = useCartStore((state) => state.addItem);

  const hasDiscount = selectedVariant.oldPrice && selectedVariant.oldPrice > selectedVariant.price;
  const discountPercent = hasDiscount
    ? Math.round(((selectedVariant.oldPrice! - selectedVariant.price) / selectedVariant.oldPrice!) * 100)
    : 0;

  const isOutOfStock = selectedVariant.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItemToCart({
      id: selectedVariant.id,
      productId: product.id,
      title: product.title,
      brand: product.brand,
      price: selectedVariant.price,
      image: product.images[0] || "",
      stock: selectedVariant.stock,
      attributes: selectedVariant.attributes,
    });

    // Анімаційний фідбек замість застарілих alert()
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white dark:bg-[#0f172a] p-4 md:p-8 rounded-3xl border border-gray-100 dark:border-slate-800/60 shadow-sm">

      {/* ЛІВА ЧАСТИНА: МЕДІА-ГАЛЕРЕЯ */}
      <div className="lg:col-span-5 space-y-4">
        <div className="w-full h-[320px] md:h-[450px] bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-900 rounded-2xl flex items-center justify-center overflow-hidden relative p-4 shadow-inner">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              src={activeImage}
              alt={product.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="max-w-full max-h-full object-contain"
            />
          </AnimatePresence>

          {hasDiscount && (
            <span className="absolute top-4 left-4 bg-rose-500 text-white font-mono text-xs font-black px-2.5 py-1 rounded-lg shadow-md animate-bounce">
              -{discountPercent}% Акція
            </span>
          )}
        </div>

        {product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto py-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-950 border shrink-0 p-1 transition-all ${activeImage === img ? "border-indigo-600 dark:border-amber-400 ring-2 ring-amber-400/20" : "border-gray-200 dark:border-slate-800 hover:border-gray-400"
                  }`}
              >
                <img src={img} alt="Прев'ю" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ПРАВА ЧАСТИНА: ХАРАКТЕРИСТИКИ ТА ЗАМОВЛЕННЯ */}
      <div className="lg:col-span-7 flex flex-col justify-between gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-amber-400 font-mono text-[10px] font-black uppercase tracking-wider rounded">
              {product.brand}
            </span>
            <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1 font-medium">
              <Store className="w-3.5 h-3.5" /> Продавець: <strong className="text-gray-700 dark:text-slate-300 font-bold">{product.shopName}</strong>
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-black tracking-tight text-gray-950 dark:text-white leading-tight">
            {product.title}
          </h1>

          {/* ЦІНА */}
          <div className="p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-900/60 flex items-baseline gap-3">
            <span className="text-2xl md:text-3xl font-black text-indigo-600 dark:text-amber-400 font-mono">
              {selectedVariant.price.toLocaleString("uk-UA")} <span className="text-lg font-bold">₴</span>
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 dark:text-gray-500 line-through font-mono">
                {selectedVariant.oldPrice?.toLocaleString("uk-UA")} ₴
              </span>
            )}
          </div>

          {/* СКЛАД */}
          <div className="flex items-center gap-1.5 text-xs font-bold">
            {isOutOfStock ? (
              <span className="text-rose-500 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Тимчасово розпродано</span>
            ) : (
              <span className="text-emerald-500 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> В наявності (Залишилось: {selectedVariant.stock} шт)</span>
            )}
          </div>

          {/* ВАРІАЦІЇ */}
          {product.variants.length > 1 && (
            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest font-mono block">Доступні модифікації лоту:</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const label = v.attributes.color || v.attributes.specification || `${v.price} ₴`;
                  const isSelected = selectedVariant.id === v.id;

                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 dark:bg-amber-400 dark:text-slate-950 dark:border-amber-400 shadow-md"
                          : "bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-800 hover:border-gray-400"
                        }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ОПИС */}
          <div className="space-y-1.5 pt-4 border-t border-gray-100 dark:border-slate-800/40">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest font-mono">Опис та комплектація лоту</h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>

        {/* СУЧАСНІ КНОПКИ ДІЙ */}
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800/40">
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`flex-1 font-black py-3 px-6 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${isOutOfStock
                  ? "bg-gray-100 dark:bg-slate-800 text-gray-400"
                  : isAdded
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-indigo-600 dark:bg-gradient-to-r dark:from-amber-400 dark:to-amber-500 text-white dark:text-slate-950 hover:opacity-95"
                }`}
            >
              {isAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
              {isOutOfStock ? "Немає в наявності" : isAdded ? "Додано у кошик!" : "Додати в кошик"}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.90 }}
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-3 rounded-2xl border flex items-center justify-center transition-colors cursor-pointer ${isWishlisted
                  ? "bg-rose-500/10 border-rose-500 text-rose-500"
                  : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-400 hover:text-rose-500"
                }`}
              aria-label="В обране"
            >
              <Heart className="w-5 h-5" style={{ fill: isWishlisted ? "currentColor" : "none" }} />
            </motion.button>
          </div>

          {/* ІНФОРМЕРИ БЕЗПЕКИ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 dark:bg-slate-950 p-3 rounded-2xl border border-gray-100 dark:border-slate-900/40 text-[11px] text-gray-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-500 dark:text-amber-400 shrink-0" />
              Швидка доставка
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500 dark:text-amber-400 shrink-0" />
              Гарантія якості
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-indigo-500 dark:text-amber-400 shrink-0" />
              14 днів на повернення
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
