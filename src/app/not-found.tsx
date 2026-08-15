'use client'

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Home, ShoppingBag, ArrowLeft, Sparkles, 
  HelpCircle, ShieldAlert, Compass
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070a13] text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-amber-400 selection:text-slate-950">
      
      {/* КІБЕРПАНК СВІТЛОВІ ЕФЕКТИ НА ФОНІ */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ГОЛОВНИЙ АНІМОВАНИЙ КОНТЕЙНЕР */}
      <div className="max-w-xl w-full text-center space-y-8 relative z-10 px-2">
        
        {/* ІНДИКАТОР ПОМИЛКИ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-xs font-black tracking-widest uppercase font-mono"
        >
          <ShieldAlert className="w-3.5 h-3.5" /> Code 404: Route Terminated
        </motion.div>

        {/* ГІГАНТСЬКИЙ КІБЕР-ТЕКСТ 404 */}
        <div className="relative select-none py-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.4 }}
            className="text-[120px] md:text-[160px] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-slate-800 via-slate-950 to-[#070a13] border-b border-slate-900 drop-shadow-[0_4px_12px_rgba(251,191,36,0.03)]"
          >
            404
          </motion.h1>
          
          {/* Накладений неоновий текст по центру */}
          <div className="absolute inset-0 flex items-center justify-center top-4">
            <motion.p 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.5, delay: 0.1 }}
              className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white bg-[#070a13]/80 px-6 py-2 rounded-2xl border border-slate-800/80 shadow-2xl font-mono"
            >
              Координати <span className="text-amber-400">Втрачено</span>
            </motion.p>
          </div>
        </div>

        {/* ТЕКСТОВИЙ ОПИС */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.3, delay: 0.2 }}
          className="space-y-2.5"
        >
          <h2 className="text-lg font-extrabold text-slate-300">Сторінку не знайдено або її перенесено</h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            Маршрут, за яким ви намагаєтеся отримати доступ, відсутній у реєстрі VelaMarket. Можливо, посилання застаріло або вендор змінив адресу лоту.
          </p>
        </motion.div>

        {/* МАТРИЦЯ ШВИДКИХ ПОРТАЛІВ (КНОПКИ) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.3, delay: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left font-sans"
        >
          
          {/* НА ГОЛОВНУ */}
          <Link
            href="/"
            className="flex items-center gap-3 p-4 bg-[#111827]/40 border border-slate-800 rounded-2xl hover:border-amber-400/40 hover:bg-[#111827]/80 group transition-all duration-200"
          >
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-amber-400 group-hover:scale-105 transition-transform">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-white uppercase tracking-wider font-mono">Головний маркет</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Перейти до вітрини VelaMarket</p>
            </div>
          </Link>

          {/* В ПАНЕЛЬ АДМІНА / КАБІНЕТ */}
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-3 p-4 bg-[#111827]/40 border border-slate-800 rounded-2xl hover:border-indigo-400/40 hover:bg-[#111827]/80 group transition-all duration-200"
          >
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-indigo-400 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-white uppercase tracking-wider font-mono">Панель управління</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Повернутися у ваш кабінет HQ</p>
            </div>
          </Link>

        </motion.div>

        {/* НИЖНЯ ЕРГОНОМІЧНА КНОПКА КРОКУ НАЗАД */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.3, delay: 0.35 }}
          className="pt-4"
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors cursor-pointer group font-mono uppercase tracking-widest"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Повернутися назад
          </button>
        </motion.div>

      </div>

      {/* ДЕКОРАТИВНИЙ ФУТЕР СТОРІНКИ */}
      <div className="absolute bottom-6 text-[10px] text-slate-700 font-mono tracking-widest uppercase select-none">
        Vela.System Security Verified
      </div>

    </div>
  );
}
