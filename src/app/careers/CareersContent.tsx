"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Briefcase, MapPin, Clock, ChevronDown, CheckCircle2, Send, Users, Sparkles, Smile } from "lucide-react";

export default function CareersContent() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [selectedFile, setSelectedFile] = useState<string>("");
    const [isSent, setIsSent] = useState<boolean>(false);

    const vacancies = [
        {
            title: "Senior Front-End Engineer (Next.js / Tailwind)",
            type: "Віддалено / Офіс Київ",
            time: "Повна зайнятість",
            salary: "UAH 95 000 - 130 000",
            requirements: [
                "Досвід роботи з React та Next.js (App Router) від 4 років.",
                "Глибокі знання TypeScript та сучасних CSS-фреймворків (Tailwind v4).",
                "Досвід оптимізації Core Web Vitals для великих e-commerce платформ."
            ]
        },
        {
            title: "Менеджер з підтримки клієнтів (Customer Care)",
            type: "Віддалено (Зручні зміни)",
            time: "Повна / Часткова зайнятість",
            salary: "UAH 18 000 - 25 000",
            requirements: [
                "Вільне та грамотне володіння українською мовою (усно та письмово).",
                "Емпатія, бажання щиро допомагати людям та вирішувати складні кейси.",
                "Досвід роботи в CRM-системах та чат-платформах буде перевагою."
            ]
        },
        {
            title: "Копірайтер / Content Creator (Гаджети та техніка)",
            type: "Віддалено",
            time: "Повна зайнятість",
            salary: "UAH 22 000 - 30 000",
            requirements: [
                "Вміння просто та цікаво писати про складні технічні характеристики.",
                "Розуміння базових принципів SEO-оптимізації текстів карток товарів.",
                "Пристрасть до сучасних гаджетів (смартфони, ноутбуки, smart-home)."
            ]
        }
    ];

    const toggleVacancy = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const accordionVariants: Variants = {
        hidden: { opacity: 0, height: 0, marginTop: 0 },
        visible: {
            opacity: 1,
            height: "auto",
            marginTop: 16,
            transition: { duration: 0.25, ease: "easeInOut" }
        },
        exit: {
            opacity: 0,
            height: 0,
            marginTop: 0,
            transition: { duration: 0.2, ease: "easeInOut" }
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.06 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
    };

    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">

            {/* ХЕДЕР СТОРІНКИ */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex p-3 bg-amber-500/10 text-brand-accent rounded-2xl mb-4"
                >
                    <Briefcase size={28} />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-black tracking-tight text-gray-950 dark:text-white"
                >
                    Приєднуйся до команди VelaMarket
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2.5 font-medium leading-relaxed"
                >
                    Ми створюємо маркетплейс майбутнього, і нам потрібні сміливі, талановиті та закохані у свою справу люди. Будуй кар'єру в компанії, де цінують твої ідеї.
                </motion.p>
            </div>

            {/* СПИСОК АКТУАЛЬНИХ ВАКАНСІЙ */}
            <section className="mb-16">
                <div className="flex items-center gap-2.5 mb-6 border-b border-gray-100 dark:border-slate-800 pb-3 select-none">
                    <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <Users size={22} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                        Актуальні відкриті позиції
                    </h2>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-45px" }}
                    className="space-y-4"
                >
                    {vacancies.map((vac, idx) => {
                        const isOpen = activeFaq === idx;

                        return (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleVacancy(idx)}
                                    className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-5 text-left cursor-pointer gap-4 group"
                                >
                                    <div className="space-y-2">
                                        <h3 className="font-extrabold text-base md:text-lg text-gray-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                                            {vac.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400 dark:text-gray-500 font-bold">
                                            <span className="flex items-center gap-1"><MapPin size={14} /> {vac.type}</span>
                                            <span className="flex items-center gap-1"><Clock size={14} /> {vac.time}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 self-end sm:self-auto">
                                        <span className="text-sm font-black text-emerald-500 dark:text-emerald-400 font-mono">{vac.salary}</span>
                                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-gray-400 shrink-0 hidden sm:block">
                                            <ChevronDown size={18} />
                                        </motion.div>
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            variants={accordionVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="px-5 pb-5 border-t border-gray-50 dark:border-slate-800/40 pt-4"
                                        >
                                            <h4 className="text-xs font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-2">Основні вимоги:</h4>
                                            <ul className="space-y-2 text-xs md:text-sm text-gray-600 dark:text-gray-300 font-semibold pl-1">
                                                {vac.requirements.map((req, rIdx) => (
                                                    <li key={rIdx} className="flex items-start gap-2.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 shrink-0" />
                                                        <span>{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </section>

            {/* ФОРМА НАДСИЛАННЯ РЕЗЮМЕ */}
            <section className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm max-w-xl mx-auto">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={18} className="text-brand-accent" />
                    <h2 className="text-lg md:text-xl font-black text-gray-950 dark:text-white tracking-tight">
                        Бажаєш до команди?
                    </h2>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mb-6">
                    Заповни коротку анкету, прикріпи посилання на резюме або портфоліо, і ми зв'яжемося з тобою.
                </p>

                <AnimatePresence mode="wait">
                    {!isSent ? (
                        <motion.form
                            key="career-form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={(e) => { e.preventDefault(); setIsSent(true); }}
                            className="space-y-4"
                        >
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Прізвище та ім'я</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-800 focus:outline-none focus:border-brand-accent focus:ring-4 focus:ring-amber-400/10 transition-all font-medium"
                                    placeholder="Іван Іванов"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Посилання на резюме (Google Drive / GitHub / LinkedIn)</label>
                                <input
                                    type="url"
                                    required
                                    value={selectedFile}
                                    onChange={(e) => setSelectedFile(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-800 focus:outline-none focus:border-brand-accent focus:ring-4 focus:ring-amber-400/10 transition-all font-medium"
                                    placeholder="https://linkedin.com"
                                />
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-brand-primary dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                            >
                                <Send size={14} />
                                <span>Надіслати анкету</span>
                            </motion.button>
                        </motion.form>
                    ) : (
                        /* АНІМАЦІЯ УСПІШНОЇ ВІДПРАВКИ АНКЕТИ */
                        <motion.div
                            key="career-success"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-8 space-y-4"
                        >
                            <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-500 rounded-full animate-bounce">
                                <CheckCircle2 size={36} />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-950 dark:text-white text-base">
                                    Анкету успішно отримано!
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                                    Дякуємо за інтерес до нашої компанії. HR-менеджер розгляне твоє резюме та зв'яжеться у разі відповідності вимогам протягом 2 робочих днів.
                                </p>
                            </div>
                            <button
                                onClick={() => { setIsSent(false); setSelectedFile(""); }}
                                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer bg-transparent border-none p-0"
                            >
                                Надіслати ще одну анкету
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </main>
    )
}

