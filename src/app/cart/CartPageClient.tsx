"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { checkoutOrderAction } from "./actions";
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Loader2 } from "lucide-react";

export default function CartPageClient() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 🔥 Сучасний стейт для повідомлень в інтерфейсі замість застарілих алертів
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    department: "",
    paymentMethod: "CARD" as "CARD" | "CASH_ON_DELIVERY" | "BONUS_BALANCE",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-96 flex items-center justify-center text-sm font-mono text-slate-500 bg-[#070a13]">
        <Loader2 className="animate-spin text-amber-400 mr-2" size={16} />
        Завантаження кошика...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#070a13] pt-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-[#111827]/40 border border-slate-800/60 rounded-3xl p-8 max-w-xl mx-auto flex flex-col items-center"
        >
          <div className="p-4 bg-slate-950 text-slate-600 border border-slate-900 rounded-2xl mb-4">
            <ShoppingBag size={40} />
          </div>
          <h2 className="text-xl font-black mb-2 text-white uppercase tracking-tight font-sans">Кошик порожній</h2>
          <p className="text-xs text-slate-400 font-mono mb-6">Ви ще не додали жодного товару до кошика.</p>
          <Link href="/" className="bg-amber-400 text-slate-950 font-mono font-black py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider hover:bg-amber-300 active:scale-[0.98] transition-all">
            Перейти до покупок
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ type: null, message: "" });

    if (!formData.name || !formData.phone || !formData.city || !formData.department) {
      setFormStatus({ type: "error", message: "Будь ласка, заповніть всі обов'язкові поля доставки." });
      return;
    }

    const customerPayload = {
      name: String(formData.name).trim(),
      phone: String(formData.phone).trim(),
      city: String(formData.city).trim(),
      department: String(formData.department).trim(),
      paymentMethod: formData.paymentMethod,
    };

    const goodsPayload = items.map((item) => ({
      id: String(item.id),
      productId: String(item.productId),
      title: String(item.title || "Товар"),
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
    }));

    startTransition(async () => {
      const response = await checkoutOrderAction(customerPayload, goodsPayload);

      if (response.success) {
        // 🔥 НАЙВАЖЛИВІШЕ: Якщо сервер повернув платіжне посилання від Monobank
        if (response.paymentUrl) {
          setFormStatus({
            type: "success",
            message: "Замовлення сформовано! Перенаправлення на безпечну оплату Monobank..."
          });

          // Чистимо кошик та миттєво перенаправляємо на платіжну сторінку еквайрингу
          clearCart();
          window.location.href = response.paymentUrl;
          return;
        }

        // Логіка для звичайної післяплати (CASH_ON_DELIVERY) або бонусів
        setFormStatus({
          type: "success",
          message: `Дякуємо! Замовлення №${response.orderId?.substring(0, 8).toUpperCase()} успішно зареєстровано.`
        });

        setTimeout(() => {
          clearCart();
          // Перенаправляємо на сторінку успіху нашого сайту
          window.location.href = `/checkout/success?orderId=${response.orderId}`;
        }, 2000);

      } else {
        setFormStatus({
          type: "error",
          message: `Помилка оформлення: ${response.error}`
        });
      }
    });
  };


  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl min-h-screen bg-[#070a13] text-slate-200">
      <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-8 border-b border-slate-900 pb-4">
        Оформлення замовлення
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ЛІВА ЧАСТИНА: СПИСОК ТОВАРІВ */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xs font-black tracking-wider text-slate-400 uppercase font-mono mb-2">Ваші товари</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-[#111827]/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-950 rounded-xl border border-slate-900 p-1 flex items-center justify-center overflow-hidden shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xl">📦</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 line-clamp-2 max-w-xs md:max-w-md">{item.title}</h3>
                    <p className="text-[11px] font-mono text-amber-400 font-black mt-1">{item.price} ₴</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center bg-slate-950 border border-slate-900 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-2 text-xs font-mono font-bold text-white min-w-[20px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 bg-slate-950 border border-slate-900 rounded-xl text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ПРАВА ЧАСТИНА: UI ФОРМА ДОСТАВКИ */}
        <div className="lg:col-span-5 bg-[#111827]/40 border border-slate-800/80 rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-tight">Дані доставки</h2>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Всі поля є обов'язковими для Neon транзакції</p>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase text-slate-500 font-mono">ПІБ Отримувача</label>
              <input
                type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Іван Іванов"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white placeholder-slate-700 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase text-slate-500 font-mono">Телефон</label>
              <input
                type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="+380991234567"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-700 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-slate-500 font-mono">Місто</label>
                <input
                  type="text" name="city" required value={formData.city} onChange={handleInputChange} placeholder="Снятин"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white placeholder-slate-700 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase text-slate-500 font-mono">Відділення НП</label>
                <input
                  type="text" name="department" required value={formData.department} onChange={handleInputChange} placeholder="№2"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white placeholder-slate-700 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* СПОСІБ ОПЛАТИ */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase text-slate-500 font-mono">
                Спосіб оплати
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="CARD">Онлайн-карта (CARD)</option>
                <option value="CASH_ON_DELIVERY">Післяплата (CASH_ON_DELIVERY)</option>
                <option value="BONUS_BALANCE">Бонусний рахунок (BONUS_BALANCE)</option>
              </select>
            </div>

            {/* РАЗОМ */}
            <div className="pt-4 border-t border-slate-900 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-500 font-bold">Загальна сума:</span>
              <span className="text-base font-black text-amber-400">{getTotalPrice()} ₴</span>
            </div>

            {/* ПЛАВНА UI НОТИФІКАЦІЯ ЗАМІСТЬ АЛЕРТІВ */}
            <AnimatePresence mode="wait">
              {formStatus.type && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`p-3.5 rounded-xl text-xs font-mono font-bold border ${formStatus.type === "success"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}
                >
                  {formStatus.type === "success" ? "✓ " : "⚠️ "}
                  {formStatus.message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* КНОПКА З ЛОАДЕРОМ */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-900 disabled:text-slate-600 disabled:border-slate-800 text-slate-950 font-mono font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.99]"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  <span>Обробка бази Neon...</span>
                </>
              ) : (
                <>
                  <CreditCard size={14} />
                  <span>Підтвердити замовлення</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}

