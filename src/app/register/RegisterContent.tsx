"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function RegisterContent() {
    const router = useRouter();
    const cardRef = useRef<HTMLDivElement>(null);

    // Стани форми
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Стейт для відстеження фокусу на інпутах (для мікроанімацій іконок)
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    // Motion-змінні для реалістичного 3D-ефекту нахилу картки при русі миші
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Трансформація координат миші в градуси нахилу (обмежуємо до безпечних 7 градусів)
    const rotateX = useTransform(y, [-300, 300], [7, -7]);
    const rotateY = useTransform(x, [-300, 300], [-7, 7]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current || isSuccess) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        // Обчислюємо центр картки
        const mouseX = e.clientX - rect.left - width / 2;
        const mouseY = e.clientY - rect.top - height / 2;
        x.set(mouseX);
        y.set(mouseY);
    };

    const handleMouseLeave = () => {
        // Плавно повертаємо картку у вихідне положення, коли миша йде геть
        x.set(0);
        y.set(0);
    };

    // Просунута обробка реєстрації через реальний API роут з базою даних Neon
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) return;

        if (!acceptTerms) {
            setErrorMessage("Будь ласка, ознайомтеся та погодьтеся з правилами користування.");
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Щось пішло не так під час реєстрації.");
            }

            setIsLoading(false);
            setIsSuccess(true);
        } catch (error: any) {
            setIsLoading(false);
            setErrorMessage(error.message || "Не вдалося з'єднатися з сервером.");
        }
    };

    // Окремий обробник OAuth реєстрацій (швидкий вхід)
    const handleOAuthRegister = (provider: "google" | "telegram") => {
        setIsLoading(true);
        setErrorMessage(null);
        console.log(`Ініціалізація реєстрації через: ${provider}`);

        setTimeout(() => {
            setIsLoading(false);
            // Логіка підключення сервісів автентифікації
        }, 1200);
    };

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                router.push("/");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, router]);

    // Текст для посиленої анімації друку заголовка
    const titleText = "Створення акаунту";

    return (
        <main className="container mx-auto px-4 flex items-center justify-center min-h-[90vh] py-12 relative overflow-hidden select-none perspective-[1000px]">

            {/* СУПЕР ФОН: Абстрактні живі інтелектуальні сфери, що плавно плавають */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 40, -20, 0],
                        y: [0, -50, 30, 0],
                        scale: [1, 1.15, 0.9, 1]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 left-1/4 w-[450px] h-[450px] bg-gradient-to-tr from-amber-400/10 to-amber-500/5 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: [0, -60, 30, 0],
                        y: [0, 40, -40, 0],
                        scale: [1, 0.9, 1.1, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/10 to-purple-500/5 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-emerald-500/[0.03] rounded-full blur-[80px]"
                />
            </div>

            {/* ГОЛОВНИЙ 3D КОНТЕЙНЕР (Картка форми) */}
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
                className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-gray-100 dark:border-slate-800/80 p-6 md:p-8 rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] relative z-10"
            >
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="register-form-view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2 }}
                            style={{ transform: "translateZ(30px)" }}
                        >
                            {/* ШАПКА ФОРМИ З ПОЛІТЕРНОЮ АНІМАЦІЄЮ */}
                            <div className="text-center space-y-2 mb-6">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                    // ДОДАЙТЕ ЦЕЙ РЯДОК ПЕРЕХОДУ (TRANSITION)
                                    transition={{ rotate: { type: "tween", duration: 0.5, ease: "easeInOut" } }}
                                    className="inline-block cursor-pointer"
                                >
                                    <Logo showText={false} size="md" />
                                </motion.div>

                                <h1 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight flex justify-center overflow-hidden">
                                    {titleText.split("").map((char, index) => (
                                        <motion.span
                                            key={index}
                                            initial={{ y: 30, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.03, type: "spring", stiffness: 120 }}
                                        >
                                            {char === " " ? "\u00A0" : char}
                                        </motion.span>
                                    ))}
                                </h1>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-xs text-gray-400 dark:text-gray-500 font-semibold"
                                >
                                    Приєднуйтесь до VelaMarket та отримуйте бонуси
                                </motion.p>
                            </div>

                            {/* ПЛАВНА ПОЯВА ПОМИЛКИ */}
                            <AnimatePresence>
                                {errorMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, scale: 0.9, y: -10 }}
                                        animate={{ opacity: 1, height: "auto", scale: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0, scale: 0.9, y: -10 }}
                                        className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl flex items-start gap-2.5 text-xs font-semibold leading-relaxed"
                                    >
                                        <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                                        <span>{errorMessage}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ФОРМА РЕЄСТРАЦІЇ */}
                            <form onSubmit={handleRegister} className="space-y-4">

                                {/* Поле Ім'я */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Ім&apos;я та прізвище</label>
                                    <div className="relative">
                                        <motion.div
                                            animate={focusedInput === "name" ? { y: [-2, -6, -2], scale: 1.15, color: "#f59e0b" } : { y: 0, scale: 1, color: "#9ca3af" }}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                        >
                                            <User size={16} />
                                        </motion.div>
                                        <input
                                            type="text"
                                            required
                                            disabled={isLoading}
                                            onFocus={() => setFocusedInput("name")}
                                            onBlur={() => setFocusedInput(null)}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl bg-gray-50/50 dark:bg-slate-950/50 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-800/80 focus:outline-none focus:border-amber-400 focus:bg-white dark:focus:bg-slate-950 focus:ring-4 focus:ring-amber-400/10 transition-all font-medium disabled:opacity-60"
                                            placeholder="Олександр Коваль"
                                        />
                                    </div>
                                </div>

                                {/* Поле E-mail */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Електронна пошта</label>
                                    <div className="relative">
                                        <motion.div
                                            animate={focusedInput === "email" ? { y: [-2, -6, -2], scale: 1.15, color: "#f59e0b" } : { y: 0, scale: 1, color: "#9ca3af" }}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                        >
                                            <Mail size={16} />
                                        </motion.div>
                                        <input
                                            type="email"
                                            required
                                            disabled={isLoading}
                                            onFocus={() => setFocusedInput("email")}
                                            onBlur={() => setFocusedInput(null)}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl bg-gray-50/50 dark:bg-slate-950/50 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-800/80 focus:outline-none focus:border-amber-400 focus:bg-white dark:focus:bg-slate-950 focus:ring-4 focus:ring-amber-400/10 transition-all font-medium disabled:opacity-60"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                {/* Поле Пароль */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Пароль</label>
                                    <div className="relative">
                                        <motion.div
                                            animate={focusedInput === "password" ? { y: [-2, -6, -2], scale: 1.15, color: "#f59e0b" } : { y: 0, scale: 1, color: "#9ca3af" }}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                        >
                                            <Lock size={16} />
                                        </motion.div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            disabled={isLoading}
                                            onFocus={() => setFocusedInput("password")}
                                            onBlur={() => setFocusedInput(null)}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-11 pr-12 py-3 text-sm rounded-xl bg-gray-50/50 dark:bg-slate-950/50 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-800/80 focus:outline-none focus:border-amber-400 focus:bg-white dark:focus:bg-slate-950 focus:ring-4 focus:ring-amber-400/10 transition-all font-medium disabled:opacity-60"
                                            placeholder="Мінімум 8 символів"
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

                                {/* Чекбокс згоди */}
                                <div className="flex items-start gap-2.5 pt-1">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        disabled={isLoading}
                                        checked={acceptTerms}
                                        onChange={(e) => setAcceptTerms(e.target.checked)}
                                        className="mt-0.5 rounded border-gray-300 dark:border-slate-800 text-amber-500 focus:ring-amber-400/30 accent-amber-400 w-4 h-4 cursor-pointer"
                                    />
                                    <label htmlFor="terms" className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 leading-normal select-none cursor-pointer">
                                        Я приймаю{" "}
                                        <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">Умови використання</Link>
                                        {" "}та даю згоду на обробку персональних даних.
                                    </label>
                                </div>

                                {/* Епічна кнопка з ефектом завантаження */}
                                <motion.button
                                    whileHover={!isLoading ? { scale: 1.02, boxShadow: "0px 10px 25px rgba(245, 158, 11, 0.2)" } : {}}
                                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full mt-2 bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative"
                                >
                                    {isLoading ? (
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full block"
                                        />
                                    ) : (
                                        <>
                                            <span>Зареєструватися</span>
                                            <motion.div
                                                animate={{ x: [0, 4, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <ArrowRight size={14} />
                                            </motion.div>
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            {/* РОЗДІЛЮВАЧ */}
                            <div className="relative flex py-5 items-center">
                                <div className="flex-grow border-t border-gray-100 dark:border-slate-800/80" />
                                <span className="flex-shrink mx-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    швидка реєстрація
                                </span>
                                <div className="flex-grow border-t border-gray-100 dark:border-slate-800/80" />
                            </div>

                            {/* КНОПКИ СОЦМЕРЕЖ */}
                            <div className="grid grid-cols-2 gap-3">
                                <motion.button
                                    whileHover={{ y: -3, scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => handleOAuthRegister("google")}
                                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 dark:bg-slate-950 hover:bg-gray-100 dark:hover:bg-slate-800/60 border border-gray-100 dark:border-slate-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors duration-200 cursor-pointer disabled:opacity-50"
                                >
                                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                        <path
                                            fill="#EA4335"
                                            d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.216 1.414 15.45 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.96 0 11.57-4.894 11.57-11.79 0-.795-.085-1.4-.195-1.926H12.24z"
                                        />
                                    </svg>
                                    <span>Google</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ y: -3, scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => handleOAuthRegister("telegram")}
                                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 dark:bg-slate-950 hover:bg-gray-100 dark:hover:bg-slate-800/60 border border-gray-100 dark:border-slate-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors duration-200 cursor-pointer disabled:opacity-50"
                                >
                                    <svg className="w-4 h-4 shrink-0 text-[#26A5E4] fill-current" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.57 8.351c-.168.618-5.319 22.311-5.602 23.344-.131.479-.364.71-.628.723-.584.03-1.03-.413-1.597-.785-1.077-.704-1.688-1.121-2.733-1.808-1.207-.795-.425-1.233.264-1.947.18-.187 3.311-3.037 3.372-3.298.008-.033.014-.155-.059-.219-.074-.065-.183-.042-.261-.025-.111.024-1.884 1.196-5.319 3.518-.503.346-.959.516-1.368.507-.451-.01-1.319-.255-1.965-.465-.792-.258-1.421-.395-1.366-.834.029-.23.346-.466.953-.708 3.733-1.625 6.221-2.698 7.464-3.218 3.551-1.487 4.289-1.746 4.773-1.755.106-.002.344.024.498.15.13.106.166.249.173.354.007.106.012.338-.005.518z" />
                                    </svg>
                                    <span>Telegram</span>
                                </motion.button>
                            </div>

                            {/* ЛІНК НА ВХІД */}
                            <div className="text-center mt-6 pt-5 border-t border-gray-50 dark:border-slate-800/60 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                <span>Вже є профіль VelaMarket? </span>
                                <Link href="/login" className="text-amber-500 dark:text-amber-400 font-bold hover:underline transition-all">
                                    Увійти
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        /* КІНЕМАТОГРАФІЧНИЙ ЕКРАН УСПІХУ */
                        <motion.div
                            key="register-success-view"
                            initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            className="text-center py-8 space-y-4"
                        >
                            {/* Контейнер для іконки з правильним позиціонуванням ефекту пульсації */}
                            <div className="relative inline-flex items-center justify-center w-20 h-20 mx-auto">
                                <motion.div
                                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-emerald-500/20 rounded-full scale-125"
                                />
                                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full relative z-10">
                                    <CheckCircle2 size={44} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-black text-gray-950 dark:text-white text-xl tracking-tight">
                                    Акаунт успішно створено!
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed font-medium">
                                    Ласкаво просимо до родини VelaMarket! Ми підготували для вас вітальний бонус <span className="text-emerald-500 font-bold">150 грн</span> на першу покупку.
                                </p>
                            </div>

                            <div className="pt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-bold">
                                <Sparkles size={14} className="text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                                <span>Налаштування робочого простору...</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </main>
    );
}


