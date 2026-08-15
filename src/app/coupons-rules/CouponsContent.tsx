"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Ticket, Info, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";

export default function CouponsContent() {
  
  // Головні правила використання
  const rules = [
    {
      title: "Один купон на замовлення",
      desc: "У кожному окремому замовленні (в кошику) можна активувати лише один промокод. Знижки за різними купонами не сумуються між собою.",
      icon: CheckCircle2,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
    },
    {
      title: "Мінімальна сума кошика",
      desc: "Більшість купонів мають ліміт активації. Наприклад, стартовий купон VELA150 діє лише для замовлень на суму від UAH 1 000,00.",
      icon: Info,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20"
    },
    {
      title: "Термін дії обмежений",
      desc: "Кожен промокод має чіткі часові межі дії, які вказуються в описі акції. Після завершення акційного періоду купон стає недійсним.",
      icon: AlertTriangle,
      color: "text-rose-500 bg-rose-50 dark:bg-rose-950/20"
    }
  ];

  // Товари-винятки
  const exceptions = [
    "Товари, які вже беруть участь у глобальному супер-розпродажі (SuperDeals)",
    "Подарункові сертифікати маркетплейсу VelaMarket",
    "Акційні комплекти та набори товарів (де знижка вже закладена у вартість)",
    "Товари окремих брендів з обмеженою ціновою політикою від виробника"
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      
      {/* ХЕДЕР СТОРІНКИ */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex p-3 bg-amber-500/10 text-brand-accent rounded-2xl mb-4"
        >
          <Ticket size={28} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-black tracking-tight text-gray-950 dark:text-white"
        >
          Правила використання купонів
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2.5 font-medium leading-relaxed"
        >
          Дізнайтеся, як правильно застосовувати промокоди та отримувати максимальну вигоду від покупок на VelaMarket.
        </motion.p>
      </div>

      {/* БЛОК ГОЛОВНИХ ПРАВИЛ */}
      <section className="mb-12">
        <div className="flex items-center gap-2.5 mb-6 border-b border-gray-100 dark:border-slate-800 pb-3 select-none">
          <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <HelpCircle size={22} />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
            Базові умови активації знижок
          </h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-45px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {rules.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-4 shadow-sm`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="font-extrabold text-sm md:text-base text-gray-950 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ТОВАРИ-ВИНЯТКИ */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gray-100 dark:bg-slate-950 p-6 rounded-3xl border border-gray-200/40 dark:border-slate-900/60 mb-12"
      >
        <h3 className="font-black text-sm md:text-base text-gray-950 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" />
          Обмеження: на що знижка не поширюється
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-4 leading-relaxed">
          Зверніть увагу, що дія купонів та промокодів зазвичай не поширюється на такі категорії та пропозиції:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
          {exceptions.map((text, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
              <span className="leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>
      </motion.section>

      {/* ЗРАЗОК ДЛЯ КОПІЮВАННЯ БЛОКУ ОФІЦІЙНОГО ПІДПИСУ (100% ВАЛІДНИЙ) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-5 md:p-6 rounded-2xl shadow-md flex items-start gap-3.5 border border-white/5"
      >
        <div className="p-2.5 bg-white/10 rounded-xl text-brand-accent shrink-0 mt-0.5">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h4 className="font-black text-sm md:text-base tracking-tight">Чесні акції без прихованих умов</h4>
          <p className="text-xs text-gray-300 mt-1 font-medium leading-relaxed">
            Ми у VelaMarket виступаємо за прозорі умови маркетингових компаній. Усі ліміти та правила активації дисконтів завжди відображаються у вашому Кошику ще до моменту оплати замовлення. Якщо у вас виникли проблеми з копіюванням або застосуванням коду, наша цілодобова служба підтримки розв'яже питання на вашу користь.
          </p>
        </div>
      </motion.div>

    </main>
  );
}
