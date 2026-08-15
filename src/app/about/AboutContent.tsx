"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Users, ShoppingBag, Award, Eye, Heart, ShieldCheck, Zap } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function AboutContent() {
  
  // Статистика компанії в цифрах
  const stats = [
    { value: "500k+", label: "Активних покупців", icon: Users },
    { value: "50k+", label: "Товарів у каталозі", icon: ShoppingBag },
    { value: "98.4%", label: "Позитивних відгуків", icon: Award },
  ];

  // Ключові цінності екосистеми
  const values = [
    {
      title: "Клієнтоорієнтованість",
      desc: "Ваш спокій — наш головний пріоритет. Ми розширили стандартне повернення до 90 днів та надаємо підмінний фонд техніки.",
      icon: Heart,
      color: "text-rose-500 bg-rose-50 dark:bg-rose-950/20"
    },
    {
      title: "Безкомпромісна безпека",
      desc: "Жодних ризиків. Усі платежі захищені за протоколом PCI-DSS, а товари проходять потрійний контроль якості на складі.",
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
    },
    {
      title: "Швидкість та інновації",
      desc: "Ми розробляємо найшвидший інтерфейс маркетплейсу, впроваджуємо ШІ для пошуку та відправляємо замовлення день у день.",
      icon: Zap,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20"
    }
  ];

  // Налаштування суворої типізації анімацій (без помилок spring)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      
      {/* СЕКЦІЯ 1: ГОЛОВНИЙ БАНЕР ТА ПРЕЗЕНТАЦІЯ БРЕНДУ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16 mt-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="space-y-4"
        >
          <div className="inline-block">
            <Logo showText={true} size="lg" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-950 dark:text-white leading-tight">
            Маркетплейс, що випереджає час
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            **VelaMarket** народився як відповідь на застарілі та повільні інтернет-магазини. Ми поставили собі за мету створити технологічну платформу, де кожна покупка приносить задоволення, а сервіс відповідає найвищим європейським стандартам.
          </p>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Сьогодні ми об'єднуємо сотні офіційних брендів, тисячі сертифікованих товарів та надійну логістичну систему, щоб доставляти майбутнє до вашої оселі в один клік.
          </p>
        </motion.div>

        {/* Візуальний 3D-декор логотипу на великому екрані */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 20 }}
          className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 rounded-3xl p-8 min-h-[300px] flex items-center justify-center relative overflow-hidden shadow-xl border border-white/5"
        >
          <div className="absolute inset-0 bg-radial from-amber-400/10 to-transparent pointer-events-none" />
          <div className="text-[140px] select-none pointer-events-none animate-bounce" style={{ animationDuration: "6s" }}>
            🚀
          </div>
        </motion.div>
      </div>

      {/* СЕКЦІЯ 2: ЦИФРИ ТА СТАТИСТИКА (МАСШТАБ) */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16 border-t border-b border-gray-100 dark:border-slate-800 py-8 bg-white dark:bg-slate-900 rounded-3xl px-6 shadow-sm"
      >
        {stats.map((stat, idx) => {
          const StatIcon = stat.icon;
          return (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="flex items-center gap-4 justify-center sm:justify-start p-2"
            >
              <div className="p-3.5 bg-amber-500/10 text-brand-accent rounded-2xl">
                <StatIcon size={24} />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl md:text-3xl font-black text-gray-950 dark:text-white font-mono tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm font-semibold text-gray-400 dark:text-gray-500 mt-0.5">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.section>

      {/* СЕКЦІЯ 3: НАША МІСІЯ ТА ЦІННОСТІ */}
      <section className="mb-12">
        <div className="flex items-center gap-2.5 mb-8 border-b border-gray-100 dark:border-slate-800 pb-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Eye size={22} />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
            Філософія та фундаментальні цінності
          </h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-45px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {values.map((val, idx) => {
            const ValIcon = val.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-11 h-11 rounded-xl ${val.color} flex items-center justify-center mb-4 shadow-sm`}>
                    <ValIcon size={20} />
                  </div>
                  <h3 className="font-extrabold text-base text-gray-950 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {val.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mt-2 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

    </main>
  );
}
