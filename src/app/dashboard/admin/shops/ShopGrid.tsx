"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateShopStatusAction } from "./actions";
import { 
  Search, Store, Check, X, Calendar, 
  ShoppingBag, Filter, AlertCircle, ArrowUpRight 
} from "lucide-react";

interface ShopItem {
  id: string;
  name: string;
  description: string | null;
  isApproved: boolean;
  createdAt: string;
  _count: {
    products: number;
  };
}

interface ShopGridProps {
  initialShops: ShopItem[];
}

export default function ShopGrid({ initialShops }: ShopGridProps) {
  const [shops, setShops] = useState<ShopItem[]>(initialShops);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(search.toLowerCase()) ||
      (shop.description && shop.description.toLowerCase().includes(search.toLowerCase()));
    
    if (filter === "APPROVED") return matchesSearch && shop.isApproved;
    if (filter === "PENDING") return matchesSearch && !shop.isApproved;
    return matchesSearch;
  });

  const handleToggleStatus = async (shopId: string, currentStatus: boolean) => {
    setUpdatingId(shopId);
    const newStatus = !currentStatus;
    const res = await updateShopStatusAction(shopId, newStatus);
    
    if (res.success) {
      setShops(prev => prev.map(s => s.id === shopId ? { ...s, isApproved: newStatus } : s));
    }
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      {/* ФІЛЬТРИ ТА ПОШУК */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Пошук за назвою або описом магазину..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111827]/60 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#111827]/60 border border-slate-800 text-slate-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400/60 cursor-pointer"
          >
            <option value="ALL">Усі магазини</option>
            <option value="APPROVED">Активні / Верифіковані</option>
            <option value="PENDING">Очікують активації</option>
          </select>
        </div>
      </div>

      {/* МАТРИЦЯ МАГАЗИНІВ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredShops.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
              className="col-span-full p-16 bg-[#111827]/20 border border-slate-800/60 rounded-2xl text-center text-slate-500"
            >
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              Жодного вендора за обраними критеріями не знайдено.
            </motion.div>
          ) : (
            filteredShops.map((shop) => (
              <motion.div
                key={shop.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                // ВИПРАВЛЕНО: Фіксуємо чистий лінійний tween без spring-ефектів для виключення помилки keyframes
                transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
                className="bg-[#111827]/40 hover:bg-[#111827]/70 border border-slate-800/80 hover:border-slate-700/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between gap-5 relative overflow-hidden group transition-all duration-300"
              >
                {/* Декоративна лінія статусу */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] transition-colors duration-300 ${
                  shop.isApproved ? "bg-emerald-500/60" : "bg-amber-500/60"
                }`} />

                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2.5 rounded-xl border border-slate-800 ${
                        shop.isApproved ? "text-emerald-400 bg-emerald-500/5" : "text-amber-400 bg-amber-500/5"
                      }`}>
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-base group-hover:text-amber-400 transition-colors flex items-center gap-1">
                          {shop.name}
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-amber-400" />
                        </h3>
                        <span className={`inline-block text-[9px] font-black tracking-widest uppercase mt-0.5 px-2 py-0.5 rounded border ${
                          shop.isApproved 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        }`}>
                          {shop.isApproved ? "Верифікований" : "Новий лот / Очікує"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed min-h-[32px] line-clamp-2">
                    {shop.description || "Опис магазину вендором не вказано."}
                  </p>

                  <div className="flex items-center gap-4 pt-2 border-t border-slate-800/40 text-[11px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-slate-600" /> Товари: <strong className="text-slate-300">{shop._count.products} шт.</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-600" /> Створено: <strong className="text-slate-300">{shop.createdAt}</strong>
                    </span>
                  </div>
                </div>

                {/* ЕКШЕН КНОПКИ УПРАВЛІННЯ */}
                <div className="pt-2">
                  {updatingId === shop.id ? (
                    <div className="w-full py-2 bg-slate-900/40 border border-slate-800 rounded-xl text-center text-xs font-bold text-amber-400 uppercase tracking-widest animate-pulse">
                      Синхронізація БД...
                    </div>
                  ) : shop.isApproved ? (
                    <button
                      onClick={() => handleToggleStatus(shop.id, shop.isApproved)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-rose-500/30 text-rose-400 bg-rose-500/5 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      Заблокувати маркет
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleStatus(shop.id, shop.isApproved)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-amber-400/30 text-slate-900 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      Активувати продажі
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

