"use client";

import React, { useEffect, useState } from "react";
import { ProductStatus } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { updateProductStatus } from "./actions";
import { 
  ShieldAlert, Check, X, ShoppingBag, 
  Users, Store, Layers, AlertCircle, FileText, 
  ArrowUpRight, Sparkles, Clock, Calendar
} from "lucide-react";

// Для клієнтського компонента робимо динамічне завантаження через клієнтський fetch
interface AdminData {
  stats: {
    totalProducts: number;
    totalUsers: number;
    totalShops: number;
    moderationCount: number;
  };
  queue: Array<{
    id: string;
    title: string;
    brand: string | null;
    description: string | null;
    shopName: string;
    categoryName: string;
    price: number;
    sku: string;
    stock: number;
    createdAt: string;
  }>;
}

// Проста анімація для лічильників
function AnimatedCounter({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="font-mono text-3xl font-black text-white tracking-tight"
    >
      {value}
    </motion.span>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Свіжий зліпок даних через API або серверний виклик при завантаженні сторінки
  const loadDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard-stats"); // Рекомендується створити цей ендпоінт, або замінити на прямий виклик
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleAction = async (productId: string, status: ProductStatus) => {
    // Оптимістичний апдейт інтерфейсу для ідеального UX процесу
    if (data) {
      setData({
        ...data,
        stats: {
          ...data.stats,
          moderationCount: data.stats.moderationCount - 1,
          totalProducts: status === ProductStatus.APPROVED ? data.stats.totalProducts + 1 : data.stats.totalProducts
        },
        queue: data.queue.filter(item => item.id !== productId)
      });
    }
    await updateProductStatus(productId, status);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full text-slate-200"
        >
          <AlertCircle className="w-14 h-14 text-rose-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-bold text-white">Помилка завантаження Vela.HQ</h2>
          <p className="text-sm text-slate-400 mt-2">Не вдалося синхронізувати панель керування з базою даних Neon. Спробуйте оновити сторінку.</p>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-amber-400/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-amber-400 animate-spin" />
        </div>
        <p className="text-xs font-bold text-amber-400 tracking-widest uppercase animate-pulse">Завантаження систем Vela...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 pb-20">
      
      {/* ПРЕМІАЛЬНИЙ ХЕДЕР АДМІНКИ */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#0b0f19] border-b border-slate-800/60 py-10 mb-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="space-y-1.5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" /> Root Control Center
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-amber-400" />
              Панель Управління <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Vela.HQ</span>
            </h1>
            <p className="text-sm text-slate-400">Глобальний моніторинг екосистеми, фінансів та експрес-модерація карток товарів.</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        
        {/* МАТРИЦЯ ГЛОБАЛЬНОЇ СТАТИСТИКИ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Користувачі", val: data?.stats.totalUsers || 0, icon: Users, color: "from-blue-600/20 to-blue-500/5", border: "hover:border-blue-500/30", iconColor: "text-blue-400" },
            { label: "Магазини (Вендори)", val: data?.stats.totalShops || 0, icon: Store, color: "from-amber-600/20 to-amber-500/5", border: "hover:border-amber-400/30", iconColor: "text-amber-400" },
            { label: "Усього товарів", val: data?.stats.totalProducts || 0, icon: ShoppingBag, color: "from-emerald-600/20 to-emerald-500/5", border: "hover:border-emerald-500/30", iconColor: "text-emerald-400" },
            { label: "Очікують перевірки", val: data?.stats.moderationCount || 0, icon: Layers, color: "from-indigo-600/20 to-indigo-500/5", border: "border-amber-500/20 hover:border-amber-400/40", iconColor: "text-amber-400 shadow-amber-500/20 shadow-lg" }
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 20 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`bg-gradient-to-br ${card.color} bg-[#111827]/40 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex items-center justify-between transition-all duration-300 ${card.border}`}
            >
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
                <div className="mt-1">
                  <AnimatedCounter value={card.val} />
                </div>
              </div>
              <div className={`p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 ${card.iconColor}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>

                {/* ЧЕРГА НА МОДЕРАЦІЮ */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
              Черга активної перевірки ({data?.queue.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {data?.queue.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-20 text-center bg-[#0f172a]/40 border border-slate-800/80 rounded-2xl shadow-xl max-w-sm mx-auto"
                >
                  <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 rounded-full flex items-center justify-center mx-auto mb-4 font-black shadow-lg shadow-amber-400/10">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-white text-lg">Черга порожня!</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Вендори відпочивають, або ви вже схвалили всі наявні картки товарів на сьогодні.</p>
                </motion.div>
              ) : (
                data?.queue.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 100, scale: 0.9, transition: { duration: 0.25 } }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="bg-[#111827]/40 hover:bg-[#111827]/70 border border-slate-800/80 rounded-2xl shadow-xl p-6 flex flex-col lg:flex-row justify-between gap-6 hover:border-slate-700/60 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-amber-400 to-indigo-500 opacity-70" />

                    {/* ТЕКСТОВИЙ БЛОК */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-slate-300 rounded-md text-[10px] font-black uppercase tracking-wider">
                          {item.categoryName}
                        </span>
                        <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-md text-[10px] font-bold">
                          Вендор: {item.shopName}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xl font-extrabold text-white group-hover:text-amber-400 transition-colors duration-200 flex items-center gap-1.5">
                          {item.title}
                          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-amber-400" />
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold font-mono">
                          <span>БРЕНД: <strong className="text-slate-200">{item.brand || "N/A"}</strong></span>
                          <span className="text-slate-700">|</span>
                          <span>SKU: <strong className="text-slate-200">{item.sku}</strong></span>
                        </div>
                      </div>

                      {item.description && (
                        <div className="bg-[#0f172a]/60 p-4 rounded-xl border border-slate-800/80 flex gap-3 items-start shadow-inner">
                          <FileText className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                          <p className="text-xs text-slate-400 leading-relaxed italic">{item.description}</p>
                        </div>
                      )}

                      {/* МЕТА-ДАНІ КАРТКИ */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1 font-mono">
                        <span className="flex items-center gap-1.5"><Store className="w-3.5 h-3.5 text-slate-600" /> Залишок: <strong className="text-slate-300">{item.stock} шт.</strong></span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-600" /> Подано: <strong className="text-slate-300">{new Date(item.createdAt).toLocaleDateString("uk-UA")}</strong></span>
                      </div>
                    </div>

                    {/* ЦІНА ТА КНОПКИ УПРАВЛІННЯ */}
                    <div className="flex lg:flex-col justify-between lg:justify-center items-center lg:items-end gap-5 bg-[#0f172a]/30 lg:bg-transparent p-4 lg:p-0 rounded-xl lg:min-w-[200px] border border-slate-800/50 lg:border-0 shadow-inner lg:shadow-none">
                      <div className="text-left lg:text-right space-y-0.5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Ціна для ринку</p>
                        <p className="text-3xl font-black text-white font-mono tracking-tight">
                          {item.price.toLocaleString()} <span className="text-lg font-bold text-amber-400">₴</span>
                        </p>
                      </div>

                      {/* ЕКШЕН КНОПКИ */}
                      <div className="flex gap-2">
                        {/* Кнопка: Відхилити */}
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAction(item.id, ProductStatus.REJECTED)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-rose-500/30 text-rose-400 bg-rose-500/5 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-rose-950/20 cursor-pointer"
                        >
                          <X className="w-4 h-4 stroke-[2.5]" />
                          Блок
                        </motion.button>

                        {/* Кнопка: Схвалити */}
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAction(item.id, ProductStatus.APPROVED)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 border border-amber-400/30 text-slate-900 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          Публікація
                        </motion.button>
                      </div>
                    </div>

                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}

