"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } }
};

export default function UserMenu() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Беремо всі дані та функцію виходу прямо з контексту
  const auth = useAuth();
  const user = auth.user as (typeof auth.user & { avatarUrl?: string }) | null;
  const logout = auth.logout;

  // Закриття меню при кліку повз нього
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Помилка при виході:", err);
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/dashboard/admin";
    if (user.role === "VENDOR") return "/dashboard/vendor";
    return "/dashboard/buyer";
  };

  const userInitial = user?.name 
    ? user.name.charAt(0).toUpperCase() 
    : user?.email.charAt(0).toUpperCase() || "?";

  return (
    <div className="relative ml-1" ref={dropdownRef}>
      <AnimatePresence mode="wait">
        {user ? (
          <motion.button
            key="user-logged-in"
            initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 20 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-200 cursor-pointer relative group focus:ring-2 focus:ring-brand-accent/50"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || "Користувач"}
                className="w-8 h-8 rounded-full object-cover border border-white/20 shadow-md"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center text-xs font-black shadow-md border border-white/20 uppercase">
                {userInitial}
              </div>
            )}
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0f172a] animate-pulse" />
            <span className="hidden sm:inline text-xs font-medium max-w-[100px] truncate pr-2 pl-0.5 text-slate-200 group-hover:text-white">
              {user.name || "Кабінет"}
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="user-logged-out"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Link
              href="/login"
              className="hover:text-slate-900 hover:bg-brand-accent text-white transition-all duration-300 flex items-center gap-1.5 bg-white/5 px-3.5 py-2 rounded-xl border border-white/10 hover:border-brand-accent shadow-sm active:scale-95 text-xs sm:text-sm"
            >
              <User size={16} className="opacity-80" />
              <span className="hidden sm:inline">Увійти</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DROPDOWN МЕНЮ КОРИСТУВАЧА */}
      <AnimatePresence>
        {isUserMenuOpen && user && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-2.5 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-slate-200"
          >
            <div className="px-3.5 py-3 border-b border-slate-800 mb-1">
              <p className="text-sm font-bold text-white truncate">{user.name || "Користувач платформи"}</p>
              <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-md text-[10px] font-black uppercase tracking-wider">
                {user.role}
              </span>
            </div>

            <Link
              href={getDashboardLink()}
              onClick={() => setIsUserMenuOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium hover:bg-white/5 hover:text-white rounded-xl transition-all group"
            >
              <LayoutDashboard size={16} className="text-slate-400 group-hover:text-brand-accent transition-colors" />
              Панель управління
            </Link>

            <button
              onClick={() => {
                setIsUserMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-950/20 rounded-xl transition-all group mt-1 cursor-pointer"
            >
              <LogOut size={16} className="text-rose-400/80 group-hover:translate-x-0.5 transition-transform" />
              Вийти з акаунту
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
