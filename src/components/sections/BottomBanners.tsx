"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface RealCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null; // 👈 Додали поле в інтерфейс типів
}

interface BottomBannersProps {
  realCategories: RealCategory[];
}

export default function BottomBanners({ realCategories }: BottomBannersProps) {
  
  // Конфіг текстів та іконок, прив'язаний до твоїх реальних категорій
  const configBySlug: Record<string, { desc: string; emoji: string; btnBg: string; fromTo: string; border: string; accentText: string }> = {
    "home-decor": {
      desc: "Затишок у кожній деталі вашої оселі.",
      emoji: "🛋️",
      btnBg: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/10 hover:shadow-emerald-500/20", 
      fromTo: "from-emerald-950/80 to-teal-950/70", 
      border: "border-emerald-500/20",
      accentText: "group-hover/banner:text-emerald-400"
    },
    "sports-wear": {
      desc: "Будь у формі щодня та досягай більшого.",
      emoji: "👟",
      btnBg: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/10 hover:shadow-indigo-500/20", 
      fromTo: "from-indigo-950/80 to-blue-950/70", 
      border: "border-indigo-500/20",
      accentText: "group-hover/banner:text-indigo-400"
    },
    "beauty-care": {
      desc: "Догляд та краса, на яку ви справді заслуговуєте.",
      emoji: "🧴",
      btnBg: "bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold shadow-amber-500/10 hover:shadow-amber-500/20", 
      fromTo: "from-amber-950/80 to-orange-950/70", 
      border: "border-amber-500/20",
      accentText: "group-hover/banner:text-amber-400"
    }
  };

  // Дефолтні метадані для будь-якої іншої категорії
  const defaultMeta = {
    desc: "Найкращі пропозиції від локальних брендів.",
    emoji: "🌟",
    btnBg: "bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold",
    fromTo: "from-slate-950 to-gray-900",
    border: "border-slate-800",
    accentText: "group-hover/banner:text-amber-400"
  };

  // Резервна преміальна фонова картинка, якщо в базі поле imageUrl порожнє (null)
  const fallbackBgImage = "https://unsplash.com";

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const bannerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
  };

  if (!realCategories || realCategories.length === 0) return null;

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full"
    >
      {realCategories.map((category, idx) => {
        const meta = configBySlug[category.slug] || defaultMeta;
        
        // Пріоритет: спочатку беремо реальне фото з Neon DB, якщо його немає — включаємо резерв
        const finalBgImage = category.imageUrl || fallbackBgImage;

        return (
          <motion.div 
            key={category.id || idx} 
            variants={bannerVariants}
            whileHover={{ y: -5 }}
            className={`relative p-6 rounded-3xl flex items-center justify-between border ${meta.border} shadow-xl overflow-hidden group/banner transition-all duration-300 min-h-[180px] bg-slate-900`}
          >
            {/* 📸 ФОНОВА КАРТИНКА — ДИНАМІЧНО З БАЗИ ДАНИХ NEON */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden rounded-3xl">
              <img 
                src={finalBgImage} 
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover/banner:scale-105 brightness-[0.35]" 
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${meta.fromTo} opacity-50 mix-blend-multiply`} />
            </div>

            {/* КОНТЕНТ */}
            <div className="max-w-[65%] relative z-10">
              <h3 className={`font-black text-white text-base md:text-lg tracking-tight transition-colors duration-200 ${meta.accentText}`}>
                {category.name}
              </h3>
              <p className="text-xs text-slate-300 dark:text-slate-400 mt-1 mb-5 font-medium leading-relaxed">
                {meta.desc}
              </p>
              
              <Link 
                href={`/catalog/${category.slug}`} 
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-md active:scale-95 ${meta.btnBg}`}
              >
                <span>До покупок</span>
                <ChevronRight size={14} className="transform group-hover/banner:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* ЕМОДЗІ */}
            <div className="absolute right-4 bottom-4 md:right-6 md:bottom-6 text-6xl select-none pointer-events-none z-10 drop-shadow-lg">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.4 }}
                className="transform group-hover/banner:scale-110 group-hover/banner:-rotate-12 transition-transform duration-500 ease-out origin-bottom-right"
              >
                {meta.emoji}
              </motion.div>
            </div>

            {/* ДЕКОРАТИВНИЙ БЛІК */}
            <div className="absolute -right-10 -top-10 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none transition-transform duration-700 group-hover/banner:scale-150" />
          </motion.div>
        );
      })}
    </motion.section>
  );
}
