"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { BookOpen, Calendar, Clock, ChevronRight, Sparkles, Filter } from "lucide-react";
import Link from "next/link";

export default function BlogContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");

  const categories = ["Все", "Гаджети", "Розумний дім", "Поради"];

  const posts = [
    {
      id: 1,
      title: "Як вибрати смартфон у 2026 році: головні тренди та пастки",
      desc: "Розбираємося, які характеристики дійсно важливі для сучасного смартфона, а за що виробники змушують вас переплачувати маркетингові бюджети.",
      category: "Гаджети",
      date: "12 Серпня, 2026",
      readTime: "5 хв",
      emoji: "📱",
      href: "/blog/how-to-choose-smartphone"
    },
    {
      id: 2,
      title: "Екосистема розумного дому: з чого почати автоматизацію оселі",
      desc: "Покроковий гід зі створення комфортного та безпечного розумного дому без значних фінансових витрат. Огляд сумісних датчиків та хабів.",
      category: "Розумний дім",
      date: "08 Серпня, 2026",
      readTime: "7.хв",
      emoji: "🏠",
      href: "/blog/smart-home-guide"
    },
    {
      id: 3,
      title: "5 лайфхаків для продовження життя акумулятора вашого ноутбука",
      desc: "Прості та дієві правила правильного заряджання, налаштування операційної системи та догляду за батареєю лептопа від сервісних інженерів.",
      category: "Поради",
      date: "01 Серпня, 2026",
      readTime: "4 хв",
      emoji: "💻",
      href: "/blog/laptop-battery-hacks"
    }
  ];

  // Фільтрація статей за категоріями
  const filteredPosts = selectedCategory === "Все" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  // Конфігурація анімацій без помилок spring
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl min-h-screen">
      
      {/* ХЕДЕР СТОРІНКИ */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex p-3 bg-indigo-500/10 text-brand-accent rounded-2xl mb-4"
        >
          <BookOpen size={28} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-black tracking-tight text-gray-950 dark:text-white"
        >
          Блог VelaMarket
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2.5 font-medium leading-relaxed"
        >
          Цікаві огляди новітніх технологій, практичні поради від експертів та лайфхаки, які зроблять ваше життя простішим та комфортнішим.
        </motion.p>
      </div>

      {/* ПАНЕЛЬ ФІЛЬТРІВ (КАТЕГОРІЇ) */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar border-b border-gray-100 dark:border-slate-800/60 select-none">
        <div className="text-gray-400 dark:text-gray-500 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider shrink-0 mr-1">
          <Filter size={14} /> Фільтр:
        </div>
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border ${
              selectedCategory === cat
                ? "bg-brand-primary text-white border-brand-primary dark:bg-slate-800 dark:border-slate-700 shadow-sm"
                : "bg-white text-gray-600 border-gray-200/60 dark:bg-slate-900 dark:text-gray-400 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* СІТКА СТАТЕЙ БЛОГУ */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {filteredPosts.map((post) => (
          <motion.article
            key={post.id}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between group/card relative transition-all duration-300"
          >
            <div>
              {/* Прев'ю-заглушка з Емодзі */}
              <div className="h-44 bg-gray-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-6xl mb-4 relative overflow-hidden shadow-inner group/img">
                <span className="transform group-hover/card:scale-110 transition-transform duration-500 select-none">
                  {post.emoji}
                </span>
                <span className="absolute top-3 left-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider rounded-lg border border-gray-100/50 dark:border-slate-800/60">
                  {post.category}
                </span>
              </div>

              {/* Мета-дані поста */}
              <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500 font-bold mb-2.5">
                <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
              </div>

              {/* Заголовок та опис */}
              <h3 className="font-black text-base md:text-lg text-gray-950 dark:text-white tracking-tight leading-snug line-clamp-2 min-h-[48px] md:min-h-[56px] group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-2 leading-relaxed line-clamp-3">
                {post.desc}
              </p>
            </div>

            {/* Посилання / КнопкаЧитати */}
            <div className="mt-6 pt-4 border-t border-gray-50 dark:border-slate-800/40">
              <Link 
                href={post.href}
                className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors group/link"
              >
                <span>Читати статтю</span>
                <ChevronRight size={14} className="transform group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.article>
        ))}
      </motion.section>

      {/* ПУСТА КАРТКА ПРИ ВІДСУТНОСТІ РЕЗУЛЬТАТІВ */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12 border border-dashed border-gray-200 dark:border-slate-800 rounded-3xl">
          <p className="text-sm font-bold text-gray-400 dark:text-gray-500">У цій категорії поки що немає опублікованих статей.</p>
        </div>
      )}

    </main>
  );
}
