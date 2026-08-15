"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { HelpCircle, ChevronDown, MessageSquare, Phone, Mail } from "lucide-react";

export default function FaqContent() {
  // Стейт зберігає лише номер відкритої вкладки (number) або null (все закрито)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Як швидко ви відправляєте замовлення?",
      a: "Замовлення, оформлені до 16:00, ми відправляємо у той самий день. Оформлені пізніше — наступного робочого дня. Середній термін доставки Новою Поштою становить 1–2 дні."
    },
    {
      q: "Чи можу я перевірити товар при отриманні?",
      a: "Так, обов'язково! При доставці Новою Поштою або Укрпоштою ви маєте повне право відкрити посилку, оглянути пристрій, перевірити його комплектацію та увімкнути для перевірки працездатності до здійснення оплати."
    },
    {
      q: "Як скористатися купоном на знижку?",
      a: "Введіть промокод (наприклад, VELA150) у спеціальне поле на сторінці оформлення Кошика. Система автоматично перерахує загальну суму замовлення з урахуванням знижки, якщо виконано умови акції."
    },
    {
      q: "Що робити, якщо товар мені не підійшов?",
      a: "Ви можете обміняти або повернути товар належної якості протягом 14 днів з моменту покупки. Головна умова — збереження товарного вигляду, пломб, ярликів та оригінальної упаковки пристрою."
    },
    {
      q: "Чи безпечно оплачувати замовлення карткою онлайн?",
      a: "Абсолютно безпечно. Всі платежі на нашому сайті проходять через захищені шлюзи, сертифіковані за міжнародним стандартом безпеки PCI-DSS. Ми не зберігаємо дані ваших карток."
    },
    {
      q: "Які документи підтверджують мою гарантію?",
      a: "Разом із товаром ви отримуєте фіскальний чек та офіційний гарантійний талон із підписом і печаткою нашого маркетплейсу або виробника, де вказано термін сервісного обслуговування."
    }
  ];

  // Повністю виправлена функція перемикання (без помилок truthy)
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Конфігурація плавного розкриття відповіді (чітко типізована через Variants)
  const accordionVariants: Variants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { 
      opacity: 1, 
      height: "auto", 
      marginTop: 12,
      transition: { duration: 0.25, ease: "easeInOut" } 
    },
    exit: { 
      opacity: 0, 
      height: 0, 
      marginTop: 0,
      transition: { duration: 0.2, ease: "easeInOut" } 
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl min-h-screen">
      
      {/* ХЕДЕР СТОРІНКИ */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex p-3 bg-indigo-500/10 text-brand-accent rounded-2xl mb-4"
        >
          <HelpCircle size={28} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-black tracking-tight text-gray-950 dark:text-white"
        >
          Часті запитання
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2.5 font-medium leading-relaxed"
        >
          Знайдіть миттєві відповіді на найпопулярніші запитання про роботу маркетплейсу VelaMarket, зібрані в одному місці.
        </motion.p>
      </div>

      {/* СПИСОК ЗАПИТАНЬ (АКОРДЕОН) */}
      <section className="space-y-3.5 mb-16">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden transition-all duration-200"
            >
              {/* Кнопка-запитання */}
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-sm md:text-base text-gray-950 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer select-none gap-4"
              >
                <span>{faq.q}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-gray-400 shrink-0"
                >
                  <ChevronDown size={18} />
                </motion.div>
              </button>

              {/* Анімована відповідь */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    variants={accordionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="px-5 pb-5 text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed border-t border-gray-50 dark:border-slate-800/40"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </section>

      {/* БЛОК ЗВОРТНОГО ЗВ'ЯЗКУ */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gray-100 dark:bg-slate-950 p-6 rounded-3xl border border-gray-200/40 dark:border-slate-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="flex gap-4">
          <div className="p-3 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-sm shrink-0 h-fit">
            <MessageSquare size={22} />
          </div>
          <div>
            <h3 className="font-black text-sm md:text-base text-gray-950 dark:text-white tracking-tight">Не знайшли відповіді?</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium leading-relaxed">
              Наша цілодобова служба підтримки готова допомогти вам у будь-який час дня та ночі. Зв'яжіться з нами зручним способом!
            </p>
          </div>
        </div>

        {/* Контакти швидкої допомоги */}
        <div className="flex flex-wrap gap-3 font-semibold text-xs text-gray-700 dark:text-gray-300 w-full md:w-auto">
          <a href="tel:0800123456" className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200/50 dark:border-slate-800 px-4 py-2.5 rounded-xl hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm w-full sm:w-auto justify-center">
            <Phone size={14} /> 0 800 123 456
          </a>
          <a href="mailto:support@velamarket.ua" className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200/50 dark:border-slate-800 px-4 py-2.5 rounded-xl hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm w-full sm:w-auto justify-center">
            <Mail size={14} /> support@velamarket.ua
          </a>
        </div>
      </motion.div>

    </main>
  );
}
