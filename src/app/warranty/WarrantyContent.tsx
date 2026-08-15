"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { 
  ShieldCheck, 
  Clock, 
  Wrench, 
  FileCheck, 
  AlertOctagon, 
  CheckCircle2, 
  HelpCircle,
  Building
} from "lucide-react";

export default function WarrantyContent() {
  
  // Терміни гарантії за категоріями
  const warrantyTerms = [
    { title: "Смартфони та планшети", period: "12–24 місяці", desc: "Офіційна гарантія від виробника (Apple, Samsung, Xiaomi)." },
    { title: "Ноутбуки та ПК", period: "12–36 місяців", desc: "Повне обслуговування, включаючи заміну комплектуючих." },
    { title: "Побутова техніка", period: "24–48 місяців", desc: "Розширена гарантія на двигуни та компресори від брендів." },
    { title: "Аксесуари та кабелі", period: "1–6 місяців", desc: "Гарантія на заводський брак для дрібної периферії." },
  ];

  // Кроки для звернення по гарантії
  const serviceSteps = [
    {
      step: "01",
      title: "Знайти документи",
      desc: "Підготуйте гарантійний талон VelaMarket (або виробника) та чек про оплату замовлення.",
      icon: FileCheck,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20"
    },
    {
      step: "02",
      title: "Зв'язатися з нами",
      desc: "Зателефонуйте на гарячу лінію або напишіть у чат підтримки для первинної діагностики менеджером.",
      icon: HelpCircle,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20"
    },
    {
      step: "03",
      title: "Передача в сервіс",
      desc: "Надішліть пристрій Новою Поштою або завітайте до найближчого авторизованого сервісного центру.",
      icon: Building,
      color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20"
    },
    {
      step: "04",
      title: "Ремонт та повернення",
      desc: "Інженери усувають несправність (зазвичай до 14 днів), після чого ми безкоштовно відправляємо вам працюючий пристрій.",
      icon: Wrench,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
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
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex p-3 bg-emerald-500/10 text-brand-accent rounded-2xl mb-4"
        >
          <ShieldCheck size={28} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-black tracking-tight text-gray-950 dark:text-white"
        >
          Гарантійні умови
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2.5 font-medium leading-relaxed"
        >
          Всі товари на VelaMarket є на 100% оригінальними та захищені офіційною гарантією від виробника або нашого власного сервісного центру.
        </motion.p>
      </div>

      {/* ТЕРМІНИ ГАРАНТІЇ ЗА КАТЕГОРІЯМИ */}
      <section className="mb-12">
        <div className="flex items-center gap-2.5 mb-6 border-b border-gray-100 dark:border-slate-800 pb-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Clock size={22} />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
            Офіційні терміни гарантії
          </h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {warrantyTerms.map((term, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">Категорія</span>
                <h3 className="font-extrabold text-sm md:text-base text-gray-950 dark:text-white tracking-tight mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {term.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-2 leading-relaxed">
                  {term.desc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gray-50 dark:border-slate-800/50 text-base font-black text-emerald-500 dark:text-emerald-400 font-mono">
                {term.period}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ЯК СКОРИСТАТИСЯ СЕРВІСОМ */}
      <section className="mb-12">
        <div className="flex items-center gap-2.5 mb-6 border-b border-gray-100 dark:border-slate-800 pb-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Wrench size={22} />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
            Порядок гарантійного обслуговування
          </h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-45px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {serviceSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shadow-sm`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-xl font-black font-mono text-gray-200 dark:text-slate-800 tracking-tight group-hover:text-brand-accent transition-colors">
                      {item.step}
                    </span>
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

      {/* КОЛИ ГАРАНТІЯ НЕ ДІЄ */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gray-100 dark:bg-slate-950 p-6 rounded-3xl border border-gray-200/40 dark:border-slate-900/60 mb-12"
      >
        <h3 className="font-black text-sm md:text-base text-gray-950 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <AlertOctagon size={16} className="text-amber-500" />
          Випадки, на які не поширюється гарантія
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3 leading-relaxed">
          Сервісний центр може відмовити в безкоштовному гарантійному ремонті, якщо:
        </p>
        <ul className="space-y-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
            <span>Наявні механічні пошкодження (тріщини, сколи, сліди ударів або падіння).</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
            <span>Всередину пристрою потрапила рідина, волога, комахи чи сторонні предмети.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
            <span>Виявлено сліди несанкціонованого розкриття, самостійного ремонту або зміни апаратного ПЗ.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
            <span>Серійний номер чи IMEI на пристрої видалений, стертий або змінений.</span>
          </li>
        </ul>
      </motion.section>

            {/* ОФІЦІЙНИЙ ПІДПИС */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-emerald-950 via-indigo-950 to-slate-950 text-white p-5 md:p-6 rounded-2xl shadow-md flex items-start gap-3.5 border border-white/5"
      >
        <div className="p-2.5 bg-white/10 rounded-xl text-amber-400 shrink-0 mt-0.5">
          <CheckCircle2 size={22} />
        </div>
        <div>
          <h4 className="font-black text-sm md:text-base tracking-tight">
            Сервіс європейського рівня
          </h4>
          <p className="text-xs text-gray-300 mt-1 font-medium leading-relaxed">
            Ми працюємо лише з перевіреними дистриб'юторами та авторизованими інженерами. На період тривалого ремонту складного гаджета (понад 14 днів) VelaMarket може надати аналогічний підмінний пристрій із нашого резервного фонду, щоб ви завжди залишалися на зв'язку.
          </p>
        </div>
      </motion.div>

    </main>
  );
}
