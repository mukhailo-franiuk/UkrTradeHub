"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getWishlistItems, removeFromWishlist } from "./actions";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore"; // Твій Zustand стейт для обраного
import { useAuth } from "@/context/AuthContext"; // Твій реальний контекст авторизації
import { Heart, ShoppingCart, Trash2, ArrowLeft, AlertCircle } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth(); // Отримуємо поточного користувача
  const addItemToCart = useCartStore((state) => state.addItem);
  const removeItemFromStore = useWishlistStore((state) => state.removeItem);

  // Завантаження обраного з бази за допомогою прямого user.id
  const loadFavorites = async () => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }
    
    const res = await getWishlistItems(user.id);
    if (res.success && res.favorites) {
      setFavorites(res.favorites);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFavorites();
  }, [user]); // Перезапускаємо, як тільки користувач авторизувався

  const handleRemove = async (productId: string) => {
    if (!user || !user.id) return;

    // 1. Оптимістично видаляємо зі стейту сторінки та глобального Zustand
    setFavorites((prev) => prev.filter((item) => item.product.id !== productId));
    removeItemFromStore(productId);
    
    // 2. Видаляємо безпосередньо з таблиці Neon DB
    await removeFromWishlist(productId, user.id);
  };

  const handleMoveToCart = (fav: any) => {
    const prod = fav.product;
    if (!prod) return;

    // Додаємо товар у кошик БЕЗ quantity: 1 (задовільняємо Omit<CartItem, "quantity">) [^1]
    addItemToCart({
      id: prod.id,
      productId: prod.id,
      title: prod.title,
      brand: prod.brand || "UkrTradeHub",
      price: Number(prod.price),
      image: prod.images?.[0]?.imageUrl || "",
      stock: prod.stock || 99,
      attributes: {}
    });

    // Видаляємо з обраного, бо товар уже переміщено до кошика
    handleRemove(prod.id);
  };

  // Стан, коли користувач не увійшов в систему
  if (!user) {
    return (
      <div className="min-h-screen bg-[#070a13] text-slate-200 flex items-center justify-center p-4">
        <div className="text-center py-12 bg-[#111827]/20 border border-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl">
          <AlertCircle size={44} className="mx-auto text-rose-500 mb-4 animate-bounce" />
          <h3 className="text-base font-bold text-slate-400 mb-1">Доступ обмежено</h3>
          <p className="text-xs text-slate-500 max-w-[260px] mx-auto mb-6">
            Будь ласка, увійдіть у свій особистий кабінет UkrTradeHub, щоб переглядати та синхронізувати список обраного.
          </p>
          <Link href="/login" className="inline-block px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md">
            Увійти до кабінету
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a13] text-slate-200 flex items-center justify-center font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          Зчитування списку бажань з Neon DB...
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-4xl min-h-screen bg-[#070a13] text-slate-200 pb-24">
      
      {/* ШАПКА СТОРІНКИ */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2.5 text-slate-400 hover:text-white rounded-xl bg-[#111827]/60 border border-slate-800 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white">Обрані товари</h1>
          <p className="text-xs text-slate-500 font-mono">Прямий доступ • Користувач: {user.email}</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-[#111827]/20 border border-slate-900 rounded-3xl p-6 max-w-md mx-auto">
          <Heart size={44} className="mx-auto text-slate-700 mb-4" />
          <h3 className="text-base font-bold text-slate-400 mb-1">Список обраного порожній</h3>
          <p className="text-xs text-slate-500 max-w-[260px] mx-auto mb-6">Додавайте сюди товари з каталогу чи гарячих пропозицій SuperDeals.</p>
          <Link href="/" className="inline-block px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md">
            Повернутися до каталогу
          </Link>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {favorites.map((fav) => {
              const prod = fav.product;
              if (!prod) return null;
              const firstImg = prod.images?.[0]?.imageUrl || "";

              return (
                <motion.div
                  key={fav.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="bg-[#111827]/40 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col justify-between p-3 relative group"
                >
                  {/* Кнопка видалення */}
                  <button
                    onClick={() => handleRemove(prod.id)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-slate-950/60 text-slate-400 hover:text-rose-400 border border-slate-900/40 backdrop-blur-sm transition-colors cursor-pointer z-10"
                  >
                    <Trash2 size={13} />
                  </button>

                  {/* Контент картки */}
                  <Link href={`/products/${prod.slug}`} className="space-y-3 flex-1 flex flex-col">
                    <div className="w-full aspect-square bg-slate-950 rounded-xl border border-slate-900/60 flex items-center justify-center overflow-hidden p-2 shrink-0">
                      {firstImg ? (
                        <img src={firstImg} alt={prod.title} className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <span className="text-2xl">📦</span>
                      )}
                    </div>
                    <div className="space-y-1 flex-1 flex flex-col justify-between">
                      <h3 className="text-xs font-bold text-slate-200 line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors">
                        {prod.title}
                      </h3>
                      <p className="text-xs font-mono font-black text-amber-400 pt-1">
                        {Number(prod.price).toLocaleString("uk-UA")} ₴
                      </p>
                    </div>
                  </Link>

                  {/* Перенесення в кошик */}
                  <button
                    onClick={() => handleMoveToCart(fav)}
                    className="w-full mt-3 py-2 bg-white/5 hover:bg-amber-400 text-slate-300 hover:text-slate-950 border border-white/5 hover:border-amber-400 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ShoppingCart size={12} />
                    Купити
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </main>
  );
}
