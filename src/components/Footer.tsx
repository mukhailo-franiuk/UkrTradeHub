"use client";

import React from "react";
import Link from "next/link";
import { CreditCard, ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Покупцям",
      links: [
        { label: "Доставка та оплата", href: "/delivery" },
        { label: "Обмін та повернення", href: "/returns" },
        { label: "Гарантійні умови", href: "/warranty" },
        { label: "Часті запитання (FAQ)", href: "/faq" },
      ],
    },
    {
      title: "Про компанію",
      links: [
        { label: "Про VelaMarket", href: "/about" },
        { label: "Контакти", href: "/contacts" },
        { label: "Вакансії", href: "/careers" },
        { label: "Блог", href: "/blog" },
      ],
    },
    {
      title: "Правова інформація",
      links: [
        { label: "Угода користувача", href: "/terms" },
        { label: "Політика конфиденційності", href: "/privacy" },
        { label: "Правила використання купонів", href: "/coupons-rules" },
      ],
    },
  ];

  // Масив соцмереж з вбудованими SVG (замість видалених іконок Lucide)
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      hoverClass: "hover:text-blue-600 dark:hover:text-blue-400",
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      hoverClass: "hover:text-pink-600 dark:hover:text-pink-400",
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.8.058 2.1.096 3.13 1.16 3.225 3.225.046 1.012.056 1.366.056 3.797v1.844c0 2.43-.01 2.783-.056 3.8-.096 2.073-1.126 3.13-3.225 3.225-1.012.046-1.366.055-3.797.055h-1.844c-2.43 0-2.783-.01-3.8-.055-2.073-.096-3.13-1.12-3.225-3.225-.046-1.012-.056-1.366-.056-3.797V10.16c0-2.43.01-2.784.056-3.8.096-2.073 1.12-3.13 3.225-3.225.102-.047.357-.057 1.37-.057h1.843zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.337-8.22a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      hoverClass: "hover:text-red-600 dark:hover:text-red-400",
      svg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M23.498 6.163a3.003 3.003 0 00-2.11-2.113C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.505a3.003 3.003 0 00-2.11 2.113C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.113c1.87.505 9.388.505 9.388.505s7.518 0 9.388-.505a3.003 3.003 0 002.11-2.113C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800/60 mt-16 pb-24 md:pb-8 pt-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* ВЕРХНЯ ЧАСТИНА: КАТЕГОРІЇ ПОСИЛАНЬ ТА БРЕНДИНГ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-gray-100 dark:border-slate-800">
          
          {/* Колонка бренду */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="text-xl font-black tracking-tight text-gray-950 dark:text-white">
              <span className="text-brand-accent">Vela</span>Market
            </Link>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed">
              Маркетплейс майбутнього. Найкращі гаджети, електроніка та товари для дому з гарантією та швидкою доставкою.
            </p>
            
            {/* Соціальні мережі з нативним інлайновим SVG */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, index) => (
                <Link 
                  key={index}
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-400 ${social.hoverClass} flex items-center justify-center transition-colors`}
                  aria-label={social.name}
                >
                  {social.svg}
                </Link>
              ))}
            </div>
          </div>

          {/* Динамічні колонки посилань */}
          {footerLinks.map((group, idx) => (
            <div key={idx} className="space-y-3.5">
              <h4 className="text-xs font-black text-gray-950 dark:text-white uppercase tracking-wider">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      href={link.href} 
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-brand-primary dark:hover:text-amber-400 font-medium transition-colors duration-150 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* НИЖНЯ ЧАСТИНА: КОПІРАЙТ ТА ПЛАТІЖНІ СИСТЕМИ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-gray-400 dark:text-gray-500 font-semibold select-none">
          
          <div className="flex items-center gap-1">
            <span>&copy; {currentYear}</span>
            <span className="text-gray-600 dark:text-gray-300 font-bold">VelaMarket.</span>
            <span>Всі права захищені.</span>
          </div>

          {/* Сертифікати захисту та оплати */}
          <div className="flex items-center gap-4 text-[10px] tracking-wide text-gray-400">
            <div className="flex items-center gap-1.5">
              <CreditCard size={14} className="text-gray-400 dark:text-gray-600" />
              <span>Безпечна оплата карткою</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500/80" />
              <span>Захист персональних даних PCI-DSS</span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
