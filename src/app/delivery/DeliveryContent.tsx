"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { 
  Truck, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Clock, 
  Wallet, 
  Building2, 
  Package, 
  Info
} from "lucide-react";

export default function DeliveryContent() {
  
  const deliveryMethods = [
    {
      title: "Нова Пошта (Відділення / Поштомат)",
      desc: "Найшвидший спосіб доставки по всій Україні.",
      time: "1-2 дні",
      price: "Від UAH 70 (Безкоштовно від UAH 1 500)",
      icon: Truck,
      color: "bg-rose-50 dark:bg-rose-950/20 text-rose-500",
    },
    {
      title: "Адресна доставка кур'єром",
      desc: "Доставка до дверей вашої оселі чи офісу кур'єром Нової Пошти.",
      time: "1-3 дні",
      price: "Від UAH 100",
      icon: MapPin,
      color: "bg-amber-50 dark:bg-amber-950/20 text-amber-500",
    },
    {
      title: "Укрпошта",
      desc: "Національний оператор, доставка у найвіддаленіші куточки.",
      time: "3-5 днів",
      price: "Від UAH 45 (Безкоштовно від UAH 1 000)",
      icon: Package,
      color: "bg-blue-50 dark:bg-blue-950/20 text-blue-500",
    },
  ];

  const paymentMethods = [
    {
      title: "Онлайн-оплата (Visa / MasterCard, Apple Pay, Google Pay)",
      desc: "Миттєва та безпечна оплата через сайт без додаткових комісій.",
      icon: CreditCard,
      badge: "Рекомендовано",
      color: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500",
    },
    {
      title: "Оплата частинами (Monobank / ПриватБанк)",
      desc: "Розстрочка 0% на популярні товари. Діліть суму на зручну кількість платежів.",
      icon: Building2,
      badge: "0% комісії",
      color: "bg-purple-50 dark:bg-purple-950/20 text-purple-500",
    },
    {
      title: "Накладений платіж (Післяплата)",
      desc: "Оплата готівкою або карткою при отриманні у відділенні. (Комісія перевізника: 2% + 20 грн).",
      icon: Wallet,
      badge: "При отриманні",
      color: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
    },
  ];

  // Чиста типізація констант анімацій для уникання помилок TS
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 260, damping: 22 } 
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl min-h-screen">
      
      {/* ХЕДЕР СТОРІНКИ */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-black tracking-tight text-gray-950 dark:text-white"
        >
          Доставка та оплата
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2.5 font-medium"
        >
          Ми подбали про те, щоб ваші покупки доставлялися миттєво, а платежі були надійно захищені за міжнародними стандартами.
        </motion.p>
      </div>

      {/* СЕКЦІЯ 1: ДОСТАВКА */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="mb-12"
      >
        <div className="flex items-center gap-2.5 mb-6 border-b border-gray-100 dark:border-slate-800 pb-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Truck size={22} />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
            Способи доставки по Україні
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deliveryMethods.map((method, idx) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-11 h-11 rounded-xl ${method.color} flex items-center justify-center mb-4 shadow-sm`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-extrabold text-sm md:text-base text-gray-950 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1.5 leading-relaxed">
                    {method.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 dark:border-slate-800/50 space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-400 flex items-center gap-1"><Clock size={12} /> Термін:</span>
                    <span className="text-gray-900 dark:text-white">{method.time}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-400 flex items-center gap-1"><Wallet size={12} /> Вартість:</span>
                    <span className="text-emerald-500 dark:text-emerald-400">{method.price}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* СЕКЦІЯ 2: ОПЛАТА */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="mb-12"
      >
        <div className="flex items-center gap-2.5 mb-6 border-b border-gray-100 dark:border-slate-800 pb-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CreditCard size={22} />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
            Способи оплати замовлення
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method, idx) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${method.color} flex items-center justify-center shadow-sm`}>
                      <Icon size={20} />
                    </div>
                    {method.badge && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10 font-mono">
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm md:text-base text-gray-950 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1.5 leading-relaxed">
                    {method.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ПЛАШКА БЕЗПЕКИ ТА ПІДТРИМКИ */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white p-5 md:p-6 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/5 relative overflow-hidden"
      >
        <div className="flex items-start gap-3.5 relative z-10 max-w-xl">
          <div className="p-2.5 bg-white/10 rounded-xl text-amber-400 shrink-0 mt-0.5">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h4 className="font-black text-sm md:text-base tracking-tight">100% Безпечні покупки з VelaMarket</h4>
            <p className="text-xs text-gray-300 mt-1 font-medium leading-relaxed">
              Усі транзакції захищені 256-бітним шифруванням. Гроші зберігаються на транзитному рахунку банку та передаються продавцю лише після того, як ви оглянете та заберете посилку.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10 self-end sm:self-auto">
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
            <Info size={12} className="text-amber-400" /> PCI-DSS Compliant
          </div>
        </div>
      </motion.div>

    </main>
  );
}
