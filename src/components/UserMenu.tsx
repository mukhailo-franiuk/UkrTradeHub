"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { User, LayoutDashboard, LogOut, Settings, ShieldAlert, ChevronDown } from "lucide-react";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Обчислюємо правильну адресу кабінету на основі ролі користувача з бази Neon
  const getDashboardHref = () => {
    if (!user) return "/login";
    const role = String(user.role).toUpperCase();
    if (role === "ADMIN") return "/dashboard/admin";
    if (role === "VENDOR") return "/dashboard/vendor";
    return "/dashboard/buyer";
  };

  // Закриваємо випадаюче меню, якщо користувач клікнув повз нього
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Автоматично закриваємо меню при переході на іншу сторінку
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Якщо користувач не увійшов — показуємо просту, чисту кнопку авторизації
  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all shadow-sm cursor-pointer"
      >
        <User size={14} />
        Увійти
      </Link>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      
      {/* КНОПКА-ТРИГЕР (Аватарка + Ім'я + Стрілочка) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all cursor-pointer group select-none text-white"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-inner uppercase font-mono">
          {user.name ? user.name.slice(0, 2) : "УЗ"}
        </div>
        <div className="hidden lg:flex flex-col items-start leading-tight max-w-[100px]">
          <span className="text-xs font-bold truncate w-full">{user.name || "Користувач"}</span>
          <span className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">{user.role}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-gray-400 group-hover:text-white"
        >
          <ChevronDown size={14} />
        </motion.div>
      </button>

      {/* ВИПАДАЮЧЕ МЕНЮ (МИТТЄВО ЛІКУЄМО СХОВАНІ ШАРИ КЛАСОМ z-[100]) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0f172a] dark:bg-slate-900 border border-slate-800 p-2 shadow-2xl z-[100] text-slate-200"
            style={{ transformOrigin: "top right" }}
          >
            {/* Інформаційний блок користувача всередині плашки */}
            <div className="px-3 py-2.5 border-b border-slate-800/60 mb-1.5 font-mono">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Аккаунт</p>
              <p className="text-xs font-bold text-amber-400 truncate mt-0.5">{user.email}</p>
            </div>

            <div className="space-y-0.5">
              {/* Посилання в персональний кабінет відповідно до ролі */}
              <Link
                href={getDashboardHref()}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 transition-all"
              >
                <LayoutDashboard size={14} className="text-amber-400" />
                Панель керування
              </Link>

              {/* Налаштування профілю */}
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 transition-all"
              >
                <Settings size={14} className="text-slate-400" />
                Налаштування
              </Link>
              
              {/* Системна кнопка логауту */}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10 transition-all cursor-pointer text-left"
              >
                <LogOut size={14} />
                Вийти з хабу
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

