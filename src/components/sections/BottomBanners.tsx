"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function BottomBanners() {
  const banners = [
    { 
      title: "Товари для дому", 
      desc: "Затишок у кожній деталі вашої оселі.", 
      emoji: "🛋️", 
      href: "/home-decor", 
      btnBg: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/10 hover:shadow-emerald-500/20", 
      fromTo: "from-emerald-50/60 to-teal-100/60 dark:from-emerald-950/20 dark:to-teal-950/10", 
      border: "border-emerald-100/50 dark:border-emerald-900/30",
      accentText: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
    },
    { 
      title: "Спорт і відпочинок", 
      desc: "Будь у формі щодня та досягай більшого.", 
      emoji: "👟", 
      href: "/sports-wear", 
      btnBg: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/10 hover:shadow-indigo-500/20", 
      fromTo: "from-indigo-50/60 to-blue-100/60 dark:from-indigo-950/20 dark:to-blue-950/10", 
      border: "border-indigo-100/50 dark:border-indigo-900/30",
      accentText: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
    },
    { 
      title: "Краса та здоров'я", 
      desc: "Догляд та краса, на яку ви справді заслуговуєте.", 
      emoji: "🧴", 
      href: "/beauty-care", 
      btnBg: "bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold shadow-amber-500/10 hover:shadow-amber-500/20", 
      fromTo: "from-amber-50/60 to-orange-100/60 dark:from-amber-950/20 dark:to-orange-950/10", 
      border: "border-amber-100/50 dark:border-amber-900/30",
      accentText: "group-hover:text-amber-500 dark:group-hover:text-amber-400"
    },
  ];

  // Конфігурація черговості появи банерів (Stagger)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  // Варіант анімації картки з чітким визначенням літералу "spring" для TypeScript
  const bannerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 22 
      } 
    }
  };

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full"
    >
      {banners.map((b, idx) => (
        <motion.div 
          key={idx} 
          variants={bannerVariants}
          whileHover={{ y: -5 }}
          className={`bg-gradient-to-br ${b.fromTo} p-6 rounded-3xl flex items-center justify-between border ${b.border} shadow-sm relative overflow-hidden group/banner transition-all duration-300`}
        >
          {/* Контентна частина банера */}
          <div className="max-w-[65%] relative z-10">
            <h3 className={`font-black text-gray-900 dark:text-white text-base md:text-lg tracking-tight transition-colors duration-200 ${b.accentText}`}>
              {b.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-5 font-medium leading-relaxed">
              {b.desc}
            </p>
            <Link 
              href={b.href} 
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-md active:scale-95 ${b.btnBg}`}
            >
              <span>До покупок</span>
              <ChevronRight size={14} className="transform group-hover/banner:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Інтерактивний 3D фоновий емодзі з паралакс-ефектом */}
          <div className="absolute right-4 bottom-4 md:right-6 md:bottom-6 text-7xl select-none pointer-events-none z-0">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.4 }}
              className="transform group-hover/banner:scale-115 group-hover/banner:-rotate-12 transition-transform duration-500 ease-out origin-bottom-right drop-shadow-sm filter dark:brightness-90"
            >
              {b.emoji}
            </motion.div>
          </div>

          {/* Фоновий декоративний круг для преміального бліку */}
          <div className="absolute -right-10 -top-10 w-28 h-28 bg-white/20 dark:bg-white/5 rounded-full blur-xl pointer-events-none transition-transform duration-700 group-hover/banner:scale-150" />

        </motion.div>
      ))}
    </motion.section>
  );
}
