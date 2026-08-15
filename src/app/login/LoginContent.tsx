"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Стандартний вхід за Email та Паролем
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Невірний пароль або пошта.");
      }

      // Вмикаємо стан успіху для запуску зеленого екрана анімації
      setIsLoading(false);
      setIsSuccess(true);

      // ✨ ЗАЛІЗОБЕТОННИЙ РЕДІРЕКТ В ОБХІД REACT COMPILER:
      // Використовуємо нативний макротаск браузера. Це дає системі 400мс,
      // щоб гарантовано записати кукі в пам'ять і миттєво відкрити дашборд.
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 400);

    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || "Помилка з'єднання з сервером.");
    }
  };

  // 2. Справжній вхід через Google OAuth 2.0 (З чистими параметрами шлюзу)
  const handleOAuthLogin = (provider: "google" | "facebook") => {
    if (provider === "google") {
      setIsLoading(true);
      setErrorMessage(null);

      // Офіційна адреса авторизації Google OAuth 2.0
      const rootUrl = "https://google.com";

      const redirectUri = typeof window !== "undefined"
        ? `${window.location.origin}/api/auth/callback/google`
        : "http://localhost:3000/api/auth/callback/google";

      const options = {
        redirect_uri: redirectUri,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "ВАШ_CLIENT_ID_ЯКЩО_НЕ_ПРАЦЮЄ_ENV",
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
          "https://googleapis.com",
          "https://googleapis.com",
        ].join(" "),
      };

      const qs = new URLSearchParams(options as any).toString();
      window.location.href = `${rootUrl}?${qs}`;
    } else {
      setErrorMessage("Вхід через Facebook тимчасово недоступний.");
    }
  };

  return (
    <main className="container mx-auto px-4 flex items-center justify-center min-h-[80vh] py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">

        {/* Фоновий блік */}
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="login-form-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* ШАПКА ФОРМИ */}
              <div className="text-center space-y-3 mb-6">
                <div className="inline-block">
                  <Logo showText={false} size="md" />
                </div>
                <h1 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                  Вхід до кабінету
                </h1>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
                  Введіть свої дані для доступу до VelaMarket
                </p>
              </div>

              {/* БЛОК ПОМИЛКИ З СЕРВЕРА */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl flex items-start gap-2.5 text-xs font-semibold leading-relaxed"
                  >
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ФОРМА АВТОРИЗАЦІЇ */}
              <form onSubmit={handleLogin} className="space-y-4">

                {/* Поле E-mail */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Електронна пошта</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      required
                      disabled={isLoading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 text-sm rounded-xl bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-800 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all font-medium disabled:opacity-60"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Поле Пароль */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Пароль</label>
                    <Link href="/forgot-password" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                      Забули пароль?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={isLoading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 text-sm rounded-xl bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-800 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all font-medium disabled:opacity-60"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Кнопка Увійти */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Увійти до кабінету</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Соціальні мережі */}
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800/60 text-center">
                <p className="text-xs text-gray-400 font-semibold mb-4">Або увійдіть через</p>
                <div className="grid grid-cols-2 gap-3">

                  {/* Кнопка Google */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleOAuthLogin("google")}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 dark:bg-slate-950 hover:bg-gray-100 dark:hover:bg-slate-800/60 border border-gray-100 dark:border-slate-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 transition duration-200 cursor-pointer disabled:opacity-50"
                  >
                    <span>Google</span>
                  </button>

                  {/* Кнопка Facebook */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleOAuthLogin("facebook")}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 dark:bg-slate-950 hover:bg-gray-100 dark:hover:bg-slate-800/60 border border-gray-100 dark:border-slate-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 transition duration-200 cursor-pointer disabled:opacity-50"
                  >
                    <span>Facebook</span>
                  </button>

                </div>
              </div>

            </motion.div>
          ) : (
            /* СТАН УСПІХУ (Зелений екран) */
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="flex justify-center text-emerald-500">
                <CheckCircle2 size={56} className="animate-bounce" />
              </div>
              <h2 className="text-xl font-black text-gray-950 dark:text-white">Вхід виконано!</h2>
              <p className="text-xs text-gray-400 font-semibold">Перенаправляємо вас в особистий кабінет...</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}

