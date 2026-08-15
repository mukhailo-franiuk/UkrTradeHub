"use client";

import React from "react";
import { motion ,Variants } from "framer-motion";
import { RotateCcw, Truck, ShieldCheck, Headphones } from "lucide-react";

export default function Features() {
  const items = [
    { 
      title: "Гарантія повернення", 
      desc: "Протягом 90 днів", 
      icon: RotateCcw, 
      bg: "bg-amber-50 dark:bg-amber-950/20", 
      text: "text-amber-500 dark:text-amber-400" 
    },
    { 
      title: "Безкоштовна доставка", 
      desc: "Від UAH 500", 
      icon: Truck, 
      bg: "bg-emerald-50 dark:bg-emerald-950/20", 
      text: "text-emerald-500 dark:text-emerald-400" 
    },
    { 
      title: "Захист покупця", 
      desc: "Безпечні платежі", 
      icon: ShieldCheck, 
      bg: "bg-blue-50 dark:bg-blue-950/20", 
      text: "text-blue-500 dark:text-blue-400" 
    },
    { 
      title: "Підтримка 24/7", 
      desc: "Ми завжди на зв'язку", 
      icon: Headphones, 
      bg: "bg-purple-50 dark:bg-purple-950/20", 
      text: "text-purple-500 dark:text-purple-400" 
    },
  ];

  // Конфігурація почергової появи карток
  const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Вказуємо тип : Variants для об'єкта
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", // Тепер TypeScript бачить, що це валідний літерал з типу Variants
      stiffness: 260, 
      damping: 20 
    } 
  }
};

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 border-t border-b border-gray-100 dark:border-slate-800 py-6 bg-white dark:bg-slate-900 rounded-3xl px-6 shadow-sm"
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.div 
            key={idx} 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3.5 p-2 rounded-2xl transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-slate-950/50 group"
          >
            {/* Анімований контейнер іконки з відскоком при ховері */}
            <motion.div 
              whileHover={{ rotate: [-10, 10, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
              className={`p-3.5 ${item.bg} ${item.text} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300`}
            >
              <Icon size={22} className="stroke-[2.2]" />
            </motion.div>
            
            {/* Текстовий блок */}
            <div className="select-none">
              <p className="text-xs md:text-sm font-black text-gray-950 dark:text-white tracking-tight group-hover:text-brand-primary dark:group-hover:text-amber-400 transition-colors duration-200">
                {item.title}
              </p>
              <p className="text-[11px] md:text-xs font-semibold text-gray-400 dark:text-gray-500 mt-0.5">
                {item.desc}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.section>
  );
}
