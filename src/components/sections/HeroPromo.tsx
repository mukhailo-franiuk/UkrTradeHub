"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Copy, Check, Sparkles, Flame, Gift } from "lucide-react";

// Дані для прокачаних слайдів каруселі
const slides = [
  {
    id: 1,
    badge: "Новинка",
    badgeIcon: Sparkles,
    title: "Відкрий майбутнє з VelaMarket",
    desc: "Смартфони та гаджети, які надихають на нові досягнення щодня.",
    emoji: "📱",
    href: "/promo-phones",
    gradient: "from-blue-950 via-indigo-900 to-purple-950",
  },
  {
    id: 2,
    badge: "Гарячі знижки",
    badgeIcon: Flame,
    title: "Час оновити свій робочий простір",
    desc: "Комп'ютери, монітори та топова периферія з вигодою до -30%.",
    emoji: "💻",
    href: "/computers",
    gradient: "from-slate-950 via-slate-900 to-indigo-950",
  },
  {
    id: 3,
    badge: "Ексклюзив",
    badgeIcon: Gift,
    title: "Твій затишок у кожній деталі",
    desc: "Естетичні товари для дому та декору за найкращими цінами сезону.",
    emoji: "🛋️",
    href: "/home-decor",
    gradient: "from-teal-950 via-emerald-900 to-slate-950",
  },
];

const SWIPE_THRESHOLD = 40;

export default function HeroPromo() {
  // Стани для каруселі
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Стани для купона
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

  // Живий таймер для купона
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Автопрокрутка каруселі
  useEffect(() => {
    const autoPlay = setInterval(() => handleNext(), 7000);
    return () => clearInterval(autoPlay);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeDistance = info.offset.x;
    if (swipeDistance < -SWIPE_THRESHOLD) handleNext();
    else if (swipeDistance > SWIPE_THRESHOLD) handlePrev();
  };

  const copyCoupon = async () => {
    try {
      await navigator.clipboard.writeText("VELA150");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Не вдалося скопіювати", err);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const currentSlide = slides[currentIndex];
  const BadgeIcon = currentSlide.badgeIcon;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">

      {/* ЛІВА ЧАСТИНА: СВАЙП-КАРУСЕЛЬ БАНЕРІВ */}
      <div className="lg:col-span-2 relative rounded-3xl min-h-[340px] md:min-h-[380px] overflow-hidden shadow-xl dark:shadow-black/40 border border-white/5 dark:border-slate-800 touch-pan-y">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={handleDragEnd}
            className={`absolute inset-0 w-full h-full bg-gradient-to-br ${currentSlide.gradient} text-white p-6 md:p-10 flex flex-col justify-between cursor-grab active:cursor-grabbing group`}
          >
            {/* Гігантський фоновий інтерактивний емодзі */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-4 bottom-2 md:right-8 md:bottom-4 opacity-20 md:opacity-35 text-[140px] md:text-[180px] select-none pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6"
            >
              {currentSlide.emoji}
            </motion.div>

            {/* Контент банера */}
            <div className="relative z-10 max-w-sm md:max-w-md pointer-events-none">
              <span className="inline-flex items-center gap-1.5 text-brand-accent dark:text-amber-400 text-xs font-bold uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full backdrop-blur-md">
                <BadgeIcon size={14} />
                {currentSlide.badge}
              </span>
              <h1 className="text-3xl md:text-5xl font-black mt-4 leading-tight tracking-tight text-white drop-shadow-sm">
                {currentSlide.title}
              </h1>
              <p className="mt-3 text-gray-300 text-sm md:text-base font-medium leading-relaxed opacity-90">
                {currentSlide.desc}
              </p>
            </div>

            {/* Кнопка дії */}
            <div className="relative z-10 flex items-center justify-between">
              <Link
                href={currentSlide.href}
                className="inline-flex items-center gap-2 bg-brand-accent hover:bg-amber-500 text-slate-900 font-extrabold px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95 pointer-events-auto"
              >
                Дивитися більше <ChevronRight size={18} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Стрілки керування (Десктоп) */}
        <button onClick={handlePrev} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-white transition active:scale-90" aria-label="Попередній">
          <ChevronLeft size={22} />
        </button>
        <button onClick={handleNext} className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-white transition active:scale-90" aria-label="Наступний">
          <ChevronRight size={22} />
        </button>

        {/* Індикатори точок */}
        <div className="absolute bottom-5 left-8 z-20 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setDirection(idx > currentIndex ? 1 : -1); setCurrentIndex(idx); }}
              className={`h-2 rounded-full transition-all duration-500 ${idx === currentIndex ? "w-8 bg-brand-accent" : "w-2 bg-white/30"}`}
              aria-label={`Слайд ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ПРАВА ЧАСТИНА: АВТОРИЗАЦІЯ ТА КУПОН З ТАЙМЕРОМ */}
      <div className="flex flex-col gap-6 w-full">

        {/* Картка вітання */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-slate-800/80 flex flex-col justify-between flex-1 relative overflow-hidden group"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/5 rounded-full group-hover:scale-125 transition-transform duration-500" />
          <div>
            <h3 className="font-black text-gray-900 dark:text-white text-lg tracking-tight">Вітаємо на VelaMarket!</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">Увійдіть до особистого кабінету або зареєструйтесь для отримання кешбеку та персональних пропозицій.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Link href="/login" className="py-3 text-center text-sm font-bold rounded-2xl bg-brand-primary text-white dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 transition active:scale-95 shadow-sm">
              Увійти
            </Link>
            <Link href="/register" className="py-3 text-center text-sm font-bold rounded-2xl bg-brand-accent text-slate-900 hover:bg-amber-500 transition active:scale-95 shadow-sm shadow-amber-500/5">
              Реєстрація
            </Link>
          </div>
        </motion.div>

        {/* Картка ексклюзивного купона */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/20 dark:to-orange-950/10 border border-rose-100 dark:border-rose-900/30 p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden group shadow-md"
        >
          {/* Декоративный фон купона */}
          <div className="absolute -right-8 -bottom-8 text-8xl opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 select-none pointer-events-none">🎁</div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              Купон для новачка
            </span>

            {/* Живий ретро-таймер */}
            <div className="flex items-center gap-1 font-mono text-xs font-bold text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900/80 px-2.5 py-1 rounded-lg border border-rose-100 dark:border-rose-900/40 shadow-sm">
              <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
              <span className="text-orange-500 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">UAH 150,00</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Для першого замовлення на суму від UAH 1 000,00</p>
          </div>

          {/* Інтерактивна кнопка копіювання коду */}
          <button
            onClick={copyCoupon}
            className={`w-full mt-5 border-2 border-dashed rounded-2xl p-3 text-center text-sm font-mono font-black tracking-widest flex items-center justify-center gap-2 transition-all duration-300 active:scale-98 ${copied
              ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "bg-white dark:bg-slate-900/40 border-rose-200 dark:border-rose-900/50 text-gray-700 dark:text-gray-300 hover:bg-rose-100/30 dark:hover:bg-rose-950/30"
              }`}
          >
            {copied ? (
              <>
                <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
                СКОПІЙОВАНО!
              </>
            ) : (
              <>
                <span>VELA150</span>
                <Copy size={14} className="opacity-60" />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  )
}

