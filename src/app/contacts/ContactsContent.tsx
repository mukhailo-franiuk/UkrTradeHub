"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function ContactsContent() {
    // Стани для форми зворотного зв'язку
    const [formState, setFormState] = useState({ name: "", email: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const contactCards = [
        {
            title: "Гаряча лінія",
            value: "0 800 123 456",
            sub: "Безкоштовно по Україні з усіх номерів",
            icon: Phone,
            href: "tel:0800123456",
            color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20",
        },
        {
            title: "Електронна пошта",
            value: "support@velamarket.ua",
            sub: "Для офіційних запитів та пропозицій",
            icon: Mail,
            href: "mailto:support@velamarket.ua",
            color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
        },
        {
            title: "Головний офіс",
            value: "м. Київ, вул. Хрещатик, 24",
            sub: "Адміністрація (прийом за попереднім записом)",
            icon: MapPin,
            href: "https://google.com",
            color: "text-rose-500 bg-rose-50 dark:bg-rose-950/20",
        },
        {
            title: "Графік роботи",
            value: "24/7 (Цілодобово)",
            sub: "Служба підтримки та склад працюють без вихідних",
            icon: Clock,
            href: null,
            color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20",
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.name || !formState.email || !formState.message) return;

        setIsSubmitting(true);
        // Імітація відправки на сервер
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setFormState({ name: "", email: "", message: "" });
        }, 1500);
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
    };

    return (
        <main className="container mx-auto px-4 py-8 max-w-5xl min-h-screen">

            {/* ХЕДЕР СТОРІНКИ */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex p-3 bg-brand-accent/10 text-brand-accent rounded-2xl mb-4"
                >
                    <MessageSquare size={28} />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-black tracking-tight text-gray-950 dark:text-white"
                >
                    Зв'яжіться з нами
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2.5 font-medium leading-relaxed"
                >
                    Маєте запитання щодо замовлення чи бажаєте співпрацювати? Наша команда на зв'язку 24 години на добу, щоб допомогти вам.
                </motion.p>
            </div>

            {/* СІТКА КОНТАКТНИХ КАРТОК */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
            >
                {contactCards.map((card, idx) => {
                    const CardIcon = card.icon;
                    const Tag = card.href ? "a" : "div";

                    return (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={card.href ? { y: -4 } : {}}
                            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between group relative"
                        >
                            <div>
                                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-4 shadow-sm`}>
                                    <CardIcon size={18} />
                                </div>
                                <h3 className="font-extrabold text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                    {card.title}
                                </h3>

                                {card.href ? (
                                    <a
                                        href={card.href}
                                        target={card.href.startsWith("http") ? "_blank" : undefined}
                                        rel="noopener noreferrer"
                                        className="font-black text-sm md:text-base text-gray-950 dark:text-white mt-1.5 block hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors tracking-tight"
                                    >
                                        {card.value}
                                    </a>
                                ) : (
                                    <p className="font-black text-sm md:text-base text-gray-950 dark:text-white mt-1.5 tracking-tight">
                                        {card.value}
                                    </p>
                                )}
                            </div>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold mt-3 leading-tight">
                                {card.sub}
                            </p>
                        </motion.div>
                    );
                })}
            </motion.section>

            {/* ІНТЕРАКТИВНА ФОРМА ЗВОРОТНОГО ЗВ'ЯЗКУ */}
            <section className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl mx-auto">
                <h2 className="text-lg md:text-xl font-black text-gray-950 dark:text-white tracking-tight mb-2">
                    Напишіть нам повідомлення
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mb-6">
                    Заповніть форму нижче, і наш старший менеджер надасть відповідь протягом 15 хвилин.
                </p>

                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.form
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Ваше ім'я</label>
                                    <input
                                        type="text"
                                        required
                                        value={formState.name}
                                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-800 focus:outline-none focus:border-brand-accent focus:ring-4 focus:ring-amber-400/10 transition-all font-medium"
                                        placeholder="Олексій"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">E-mail адреса</label>
                                    <input
                                        type="email"
                                        required
                                        value={formState.email}
                                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-800 focus:outline-none focus:border-brand-accent focus:ring-4 focus:ring-amber-400/10 transition-all font-medium"
                                        placeholder="alex@gmail.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Текст повідомлення</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formState.message}
                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-800 focus:outline-none focus:border-brand-accent focus:ring-4 focus:ring-amber-400/10 transition-all font-medium resize-none"
                                    placeholder="Опишіть ваше запитання або пропозицію..."
                                />
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-brand-primary dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send size={14} />
                                        <span>Надіслати звернення</span>
                                    </>
                                )}
                            </motion.button>
                        </motion.form>
                    ) : (
                        /* АНІМАЦІЯ УСПІШНОЇ ВІДПРАВКИ (БЕЗ ДУБЛЮВАННЯ ANIMATEPRESENCE) */
                        <motion.div
                            key="success"
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
                                    Повідомлення успішно надіслано!
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                                    Дякуємо за звернення. Наш спеціаліст уже вивчає деталі та зв'яжеться з вами на вказану пошту найближчим часом.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer bg-transparent border-none p-0"
                            >
                                Надіслати ще одне повідомлення
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </main>
    );
}
