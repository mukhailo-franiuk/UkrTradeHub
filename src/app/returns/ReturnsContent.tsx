"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
    RotateCcw,
    FileText,
    HelpCircle,
    CheckCircle2,
    AlertTriangle,
    ArrowLeftRight,
    ShieldCheck,
    CreditCard,
    UserCheck
} from "lucide-react";

export default function ReturnsContent() {

    // Кроки для здійснення повернення
    const returnSteps = [
        {
            step: "01",
            title: "Перевірка умов",
            desc: "Переконайтеся, що товар не має слідів використання, збережено його товарний вигляд, пломби, ярлики та оригінальну упаковку.",
            icon: UserCheck,
            color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20"
        },
        {
            step: "02",
            title: "Заповнення заяви",
            desc: "Напишіть у нашу службу підтримки або заповніть бланк заяви на повернення, який йшов разом із замовленням у коробці.",
            icon: FileText,
            color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20"
        },
        {
            step: "03",
            title: "Відправка нам",
            desc: "Надішліть товар Новою Поштою за реквізитами, які надасть менеджер. Пересилання якісного товару оплачує покупець.",
            icon: ArrowLeftRight,
            color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20"
        },
        {
            step: "04",
            title: "Повернення коштів",
            desc: "Після перевірки товару на складі ми повертаємо гроші на вашу банківську картку протягом 1–3 робочих днів.",
            icon: CreditCard,
            color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
        }
    ];

    // Списки товарів
    const nonReturnableItems = [
        "Парфумерно-косметичні вироби",
        "Засоби особистої гігієни (зубні щітки, бритви)",
        "Нижня білизна та шкарпетки",
        "Товари для немовлят (пелюшки, пляшечки)",
        "Навушники-вкладиші (після відкриття блістера з міркувань гігієни)"
    ];

    // Суворі варіанти анімацій для TypeScript (без помилок spring)
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

            {/* ЗАГОЛОВОК СТОРІНКИ */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex p-3 bg-amber-500/10 text-brand-accent rounded-2xl mb-4"
                >
                    <RotateCcw size={28} />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-black tracking-tight text-gray-950 dark:text-white"
                >
                    Обмін та повернення
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2.5 font-medium leading-relaxed"
                >
                    Купуйте впевнено! Якщо товар вам не підійшов або не виправдав очікувань, ви можете легко обміняти його або повернути свої кошти назад.
                </motion.p>
            </div>

            {/* КЛЮЧОВІ ПРАВИЛА (ІНФО-ГРАФІКА) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800/80 shadow-sm flex gap-4"
                >
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl h-fit shrink-0">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-base text-gray-950 dark:text-white tracking-tight">Що можна повернути?</h3>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed font-medium">
                            Будь-який товар належної якості, який не підійшов за формою, габаритами, фасоном або з інших причин не може бути використаний за призначенням, протягом **14 днів** з моменту покупки.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800/80 shadow-sm flex gap-4"
                >
                    <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl h-fit shrink-0">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-base text-gray-950 dark:text-white tracking-tight">Якщо виявлено брак?</h3>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed font-medium">
                            Якщо під час експлуатації виявився заводський дефект (товар неналежної якості), обмін або повернення коштів здійснюється на підставі гарантійного талона або висновку сервісного центру.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* ЧОТИРИ КРОКИ ПОВЕРНЕННЯ */}
            <section className="mb-12">
                <div className="flex items-center gap-2.5 mb-6 border-b border-gray-100 dark:border-slate-800 pb-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <HelpCircle size={22} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
                        Як оформити обмін чи повернення
                    </h2>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-45px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {returnSteps.map((item, idx) => {
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

            {/* ЩО НЕ ПІДЛЯГАЄ ПОВЕРНЕННЮ */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-100 dark:bg-slate-950 p-6 rounded-3xl border border-gray-200/40 dark:border-slate-900/60 mb-12"
            >
                <h3 className="font-black text-sm md:text-base text-gray-950 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-500" />
                    Зверніть увагу: товари, що не підлягають поверненню
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-4 leading-relaxed">
                    Відповідно до постанови Кабінету Міністрів України, існує перелік товарів належної якості, які **не підлягають** обміну або поверненню:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {nonReturnableItems.map((text, i) => (
                        <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
            </motion.section>

            {/* ГАРАНТІЯ ТА ЗАХИСТ */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-5 md:p-6 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/5"
            >
                <div className="flex items-start gap-3.5 max-w-2xl">
                    <div className="p-2.5 bg-white/10 rounded-xl text-brand-accent shrink-0 mt-0.5">
                        <ShieldCheck size={22} />
                    </div>
                    <div>
                        <h4 className="font-black text-sm md:text-base tracking-tight">Захист прав споживачів на VelaMarket</h4>
                        <p className="text-xs text-gray-300 mt-1 font-medium leading-relaxed">
                            Ми суворо дотримуємося законодавства України. Якщо виникають будь-які спірні питання щодо якості або стану пристрою, ми завжди стаємо на бік клієнта і робимо все можливе, щоб вирішити ситуацію на вашу користь у найкоротші терміни.
                        </p>
                    </div>
                </div>
            </motion.div>
            </main>
    )}
