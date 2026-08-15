"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Eye, Shield, Lock, CheckCircle2, AlertCircle, FileLock } from "lucide-react";

export default function PrivacyContent() {
  const [activeSection, setActiveSection] = useState<number>(0);

  const sections = [
    {
      title: "1. Збір персональних даних",
      content: "Адміністрація маркетплейсу VelaMarket збирає лише ті дані, які необхідні для якісного обслуговування ваших замовлень. До них відносяться: ваше ім'я, прізвище, номер телефону, e-mail адреса та адреса для доставки товарів перевізником. Збір відбувається виключно за вашої згоди при реєстрації або оформленні кошика."
    },
    {
      title: "2. Мета обробки інформації",
      content: "Ваші персональні дані використовуються для обробки та доставки замовлень, зв'язку з вами щодо деталей покупки, нарахування кешбеку в особистому кабінеті, а також для надсилання персональних знижок та акцій (ви можете відмовитися від маркетингової розсилки в будь-який момент в один клік)."
    },
    {
      title: "3. Захист та безпека даних",
      content: "Ми використовуємо передові технології шифрування для захисту вашої інформації. Усі платіжні операції проходять через захищені банківські шлюзи, сертифіковані за найвищим міжнародним стандартом безпеки PCI-DSS. VelaMarket не зберігає і не бачить дані ваших банківських карток чи паролів."
    },
    {
      title: "4. Передача третім особам",
      content: "Ми суворо дотримуємося законодавства України та регламенту GDPR. Ваші дані ні за яких умов не продаються і не передаються стороннім компаніям. Винятком є лише передача логістичним службам (наприклад, Нова Пошта чи Укрпошта) виключно тих даних, які необхідні для фізичної доставки вашої посилки."
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      
      {/* ХЕДЕР СТОРІНКИ */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl mb-4"
        >
          <Lock size={28} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-black tracking-tight text-gray-950 dark:text-white"
        >
          Політика конфіденційності
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2.5 font-medium leading-relaxed"
        >
          Конфіденційність та безпека ваших даних — наш головний пріоритет. Дізнайтеся, як ми дбаємо про захист вашої інформації.
        </motion.p>
      </div>

      {/* ДВОКОЛОНКОВА АДАПТИВНА СТРУКТУРА */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* ЛІВА ЧАСТИНА: Мобільний та десктопний швидкий зміст */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm space-y-1.5 md:sticky md:top-24">
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 pl-2 flex items-center gap-1.5 select-none">
            <FileLock size={12} /> Зміст політики
          </p>
          {sections.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSection(idx)}
              className={`w-full text-left px-3 py-2 text-xs md:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeSection === idx
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-500 font-black"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-950"
              }`}
            >
              {sec.title}
            </button>
          ))}
        </div>

        {/* ПРАВА ЧАСТИНА: Контент розділів */}
        <div className="md:col-span-2 space-y-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {sections.map((sec, idx) => {
              const isActive = activeSection === idx;
              
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className={`bg-white dark:bg-slate-900 border p-5 rounded-2xl shadow-sm transition-all duration-300 ${
                    isActive 
                      ? "border-emerald-500/40 ring-4 ring-emerald-500/5 dark:bg-slate-900" 
                      : "border-gray-100 dark:border-slate-800/80 opacity-60 md:opacity-50 hover:opacity-80"
                  }`}
                >
                  <h2 className="font-black text-sm md:text-base text-gray-950 dark:text-white tracking-tight flex items-center gap-2">
                    <Shield size={16} className={isActive ? "text-emerald-500" : "text-gray-400"} />
                    {sec.title}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mt-2.5 leading-relaxed">
                    {sec.content}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>

      {/* ЗАХИСТ ПРАВ ТА РЕДАКЦІЯ */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gray-100 dark:bg-slate-950 p-5 rounded-3xl border border-gray-200/40 dark:border-slate-900/60 mt-12 flex items-start gap-3.5"
      >
        <div className="p-2 bg-white dark:bg-slate-900 text-emerald-500 rounded-xl shadow-sm shrink-0">
          <AlertCircle size={18} />
        </div>
        <div>
          <h4 className="font-black text-sm text-gray-950 dark:text-white tracking-tight flex items-center gap-1.5">
            Ваші права згідно з Законом України та GDPR
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium leading-relaxed">
            Ви маєте повне право в будь-який момент отримати доступ до своїх даних, вимагати їх виправлення, обмеження обробки або повного безповоротного видалення з баз даних нашого маркетплейсу (право бути забутим). Для цього достатньо надіслати короткий запит у нашу службу підтримки за адресою **support@velamarket.ua**.
          </p>
        </div>
      </motion.div>

    </main>
  );
}
