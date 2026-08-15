"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Scale, Shield, FileText, CheckCircle2, AlertCircle, Info } from "lucide-react";

export default function TermsContent() {
  const [activeSection, setActiveSection] = useState<number>(0);

  const sections = [
    {
      title: "1. Загальні положення",
      content: "Ця Угода користувача регулює відносини між маркетплейсом VelaMarket (наліво — Адміністрація) та фізичною або юридичною особою, яка використовує сервіси сайту (наліво — Користувач). Використовуючи будь-яку частину сайту, Користувач автоматично погоджується з умовами цієї угоди в повному обсязі."
    },
    {
      title: "2. Реєстрація та безпека",
      content: "Для оформлення замовлень та отримання доступу до системи кешбеку Користувач може створити обліковий запис. Користувач несе повну персональну відповідальність за збереження конфіденційності свого пароля та за всі дії, що здійснюються під його логіном на платформі VelaMarket."
    },
    {
      title: "3. Порядок оформлення замовлень",
      content: "Ціни та наявність товарів, вказані на маркетплейсі, є актуальними на момент відображення. Оформлення замовлення Користувачем є підтвердженням його наміру здійснити покупку (акцептом публічної оферти). Договір купівлі-продажу вважається укладеним після підтвердження замовлення менеджером або надсилання SMS із трек-номером відправки."
    },
    {
      title: "4. Права та обов'язки сторін",
      content: "Адміністрація зобов'язується забезпечувати захист даних згідно з Політикою конфіденційності та PCI-DSS. Користувач має право на отримання якісного товару, офіційної гарантії та повернення коштів протягом 14 днів (або розширених 90 днів за умовами програм лояльності), якщо товар не має слідів використання."
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
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
          <Scale size={28} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-black tracking-tight text-gray-950 dark:text-white"
        >
          Угода користувача
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2.5 font-medium leading-relaxed"
        >
          Будь ласка, уважно ознайомтеся з правилами використання платформи VelaMarket перед здійсненням покупок.
        </motion.p>
      </div>

      {/* ДВОКОЛОНКОВА АДАПТИВНА СТРУКТУРА */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* ЛІВА ЧАСТИНА: Мобільний та десктопний швидкий зміст */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm space-y-1.5 md:sticky md:top-24">
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 pl-2 flex items-center gap-1.5 select-none">
            <FileText size={12} /> Зміст документа
          </p>
          {sections.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSection(idx)}
              className={`w-full text-left px-3 py-2 text-xs md:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeSection === idx
                  ? "bg-brand-accent/10 text-brand-primary dark:text-amber-400 border-l-4 border-brand-accent font-black"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-950"
              }`}
            >
              {sec.title.split(". ")[1]}
            </button>
          ))}
        </div>

        {/* ПРАВА ЧАСТИНА: Контент вибраного або всіх розділів */}
        <div className="md:col-span-2 space-y-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {sections.map((sec, idx) => {
              const isActive = activeSection === idx;
              
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className={`bg-white dark:bg-slate-900 border p-5 rounded-2xl shadow-sm transition-all duration-300 ${
                    isActive 
                      ? "border-brand-accent/40 ring-4 ring-amber-400/5 dark:bg-slate-900" 
                      : "border-gray-100 dark:border-slate-800/80 opacity-60 md:opacity-50 hover:opacity-80"
                  }`}
                >
                  <h2 className="font-black text-sm md:text-base text-gray-950 dark:text-white tracking-tight flex items-center gap-2">
                    <Shield size={16} className={isActive ? "text-brand-accent" : "text-gray-400"} />
                    {sec.title}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mt-2.5 leading-relaxed">
                    {sec.content}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>

      {/* ПРАВОВИЙ ДИСКЛЕЙМЕР */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gray-100 dark:bg-slate-950 p-5 rounded-3xl border border-gray-200/40 dark:border-slate-900/60 mt-12 flex items-start gap-3.5"
      >
        <div className="p-2 bg-white dark:bg-slate-900 text-amber-500 rounded-xl shadow-sm shrink-0">
          <AlertCircle size={18} />
        </div>
        <div>
          <h4 className="font-black text-sm text-gray-950 dark:text-white tracking-tight flex items-center gap-1.5">
            Юридична інформація та редакція
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium leading-relaxed">
            Ця редакція угоди користувача є чинною від 12 серпня 2026 року. Адміністрація маркетплейсу VelaMarket залишає за собою право вносити зміни до цього документа в односторонньому порядку без попереднього індивідуального сповіщення користувачів. Зміни набувають чинності з моменту їх публікації на цій сторінці.
          </p>
        </div>
      </motion.div>

    </main>
  );
}
