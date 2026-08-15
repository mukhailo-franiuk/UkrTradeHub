"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { checkoutOrderAction } from "./actions"; // Наш адаптований під Prisma Server Action
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, CreditCard, ShieldCheck, Loader2 } from "lucide-react";

export default function CartPageClient() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition(); // Індикатор завантаження для Server Action

  // Вирішення проблеми гідратації Zustand persist
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Стейт форми, адаптований під ENUM PaymentMethod вашої Prisma-схеми
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    department: "",
    paymentMethod: "CARD" as "CARD" | "CASH_ON_DELIVERY" | "BONUS_BALANCE",
  });

  if (!isMounted) {
    return <div className="h-96 flex items-center justify-center text-sm font-medium text-gray-400">Завантаження кошика...</div>;
  }

  // Стан порожнього кошика
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-100 dark:border-slate-800/60 p-8 shadow-sm flex flex-col items-center max-w-xl mx-auto"
      >
        <div className="p-4 bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-2xl mb-4">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Ваш кошик порожній</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Здається, ви ще не додали жодного товару до кошика.</p>
        <Link href="/" className="bg-indigo-600 dark:bg-amber-400 text-white dark:text-slate-950 font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-md hover:opacity-90 transition-opacity">
          Перейти до покупок
        </Link>
      </motion.div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ФУНКЦІЯ ВІДПРАВКИ ЗАМОВЛЕННЯ НА БЕКЕНД В NEON
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.city || !formData.department) {
      alert("Будь ласка, заповніть всі обов'язкові поля доставки.");
      return;
    }

    // Викликаємо транзакційний Server Action через Transition блок
    startTransition(async () => {
      const response = await checkoutOrderAction(formData, items);

      if (response.success) {
        alert(`Дякуємо, ${formData.name}! Замовлення №${response.orderId?.substring(0, 8).toUpperCase()} успішно зареєстровано в системі Vela.`);
        clearCart(); // Повністю чистимо клієнтський стейт та localStorage
      } else {
        // Виведення помилки від транзакції бази (наприклад, якщо розкупили товар, поки заповнювали форму)
        alert(`Помилка оформлення: ${response.error}`);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      {/* ЛІВА ЧАСТИНА: СПИСОК ТОВАРІВ (7 КОЛОНОК) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-4 md:p-6 border border-gray-100 dark:border-slate-800/60 shadow-sm">
          <h2 className="text-sm font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest font-mono mb-4">Ваші товари</h2>

          <div className="divide-y divide-gray-100 dark:divide-slate-800/60">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  exit={{ opacity: 0, x: -20 }}
                  className="py-4 flex gap-4 items-center justify-between first:pt-0 last:pb-0"
                >
                  {/* Зображення варіації */}
                  <div className="w-16 h-16 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-100 dark:border-slate-900 shrink-0 p-1 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="text-2xl">🛒</span>
                    )}
                  </div>

                  {/* Опис та назва лоту */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-indigo-600">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">Бренд: {item.brand}</p>
                    {item.attributes?.color && (
                      <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 rounded font-bold text-slate-500">
                        {item.attributes.color}
                      </span>
                    )}
                  </div>

                  {/* Зміна кількості */}
                  <div className="flex items-center gap-2 border border-gray-200 dark:border-slate-800 rounded-xl p-1 bg-white dark:bg-slate-950">
                    <button
                      type="button" disabled={isPending}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-lg text-gray-500 transition-colors disabled:opacity-30"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-xs font-mono font-bold w-6 text-center text-gray-800 dark:text-gray-200">{item.quantity}</span>
                    <button
                      type="button" disabled={isPending}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-lg text-gray-500 transition-colors disabled:opacity-30"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Фінальна вартість */}
                  <div className="text-right min-w-[70px]">
                    <p className="text-sm md:text-base font-black text-gray-900 dark:text-white font-mono">
                      {(item.price * item.quantity).toLocaleString("uk-UA")} ₴
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 font-mono">{item.price} ₴ / шт</p>
                  </div>

                  {/* Кнопка видалення */}
                  <button
                    type="button" disabled={isPending}
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-xl transition-colors disabled:opacity-30 cursor-pointer"
                    aria-label="Видалити"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ПРАВА ЧАСТИНА: АНКЕТА ДОСТАВКИ ТА ЧЕК (5 КОЛОНОК) */}
      <form onSubmit={handleSubmitOrder} className="lg:col-span-5 space-y-6">

        {/* АНКЕТА КЛІЄНТА */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-4 md:p-6 border border-gray-100 dark:border-slate-800/60 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest font-mono">Дані доставки (Нова Пошта)</h2>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Прізвище та Ім'я отримувача</label>
              <input
                type="text" required name="name" disabled={isPending} value={formData.name} onChange={handleInputChange}
                placeholder="Іванов Іван"
                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 dark:focus:border-amber-400 text-gray-900 dark:text-white transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Контактний номер телефону</label>
              <input
                type="tel" required name="phone" disabled={isPending} value={formData.phone} onChange={handleInputChange}
                placeholder="+380 99 123 45 67"
                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 dark:focus:border-amber-400 text-gray-900 dark:text-white transition-colors disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Місто доставки</label>
                <input
                  type="text" required name="city" disabled={isPending} value={formData.city} onChange={handleInputChange}
                  placeholder="Київ"
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 dark:focus:border-amber-400 text-gray-900 dark:text-white transition-colors disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">№ Відділення / Поштомат</label>
                <input
                  type="text" required name="department" disabled={isPending} value={formData.department} onChange={handleInputChange}
                  placeholder="Відділення №1"
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 dark:focus:border-amber-400 text-gray-900 dark:text-white transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Спосіб оплати</label>
              <select
                name="paymentMethod" disabled={isPending} value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 dark:text-slate-300 focus:outline-none disabled:opacity-50 cursor-pointer"
              >
                <option value="CARD">Оплата карткою на сайті (Visa/Mastercard)</option>
                <option value="CASH_ON_DELIVERY">Накладений платіж (При отриманні)</option>
                <option value="BONUS_BALANCE">Оплата з бонусного балансу</option>
              </select>
            </div>
          </div>
        </div>

        {/* БЛОК ЧЕКУ ТА ПІДБИТТЯ ПІДСУМКІВ */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-4 md:p-6 border border-gray-100 dark:border-slate-800/60 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest font-mono">Підсумок замовлення</h2>

          <div className="space-y-2 text-xs font-medium text-gray-600 dark:text-slate-400 font-mono">
            <div className="flex justify-between">
              <span>Сума товарів:</span>
              <span className="text-gray-900 dark:text-white">{getTotalPrice().toLocaleString("uk-UA")} ₴</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-gray-400">
              <span className="flex items-center gap-1"><Truck size={12} /> Доставка (Нова Пошта):</span>
              <span>За тарифами перевізника</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-slate-800/40 flex justify-between items-baseline">
            <span className="text-sm font-bold text-gray-900 dark:text-white">До сплати:</span>
            <span className="text-xl md:text-2xl font-black text-indigo-600 dark:text-amber-400 font-mono">
              {getTotalPrice().toLocaleString("uk-UA")} ₴
            </span>
          </div>

          {/* КНОПКА КУПИТИ З ЛОАДЕРОМ */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isPending}
            className="w-full bg-indigo-600 dark:bg-gradient-to-r dark:from-amber-400 dark:to-amber-500 text-white dark:text-slate-950 font-black py-3 px-6 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Оформлення...
              </>
            ) : (
              <>
                Підтвердити замовлення
                <ArrowRight size={14} />
              </>
            )}
          </motion.button>

          {/* Інформери безпеки */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] text-gray-400 font-medium">
            <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500" /> Безпечна транзакція</div>
            <div className="flex items-center gap-1.5"><CreditCard size={12} className="text-indigo-400" /> Шифрування SSL</div>
          </div>
        </div>

      </form>
    </div>
  );
}

