"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface LogoProps {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ showText = true, size = "md" }: LogoProps) {
  // Налаштування розмірів залежно від пропсу
  const dimensions = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-2xl" },
    lg: { icon: 48, text: "text-4xl" },
  }[size];

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group select-none cursor-pointer">
      {/* ІНТЕРАКТИВНА ВЕКТОРНА ІКОНКА (ЗНАК БРЕНДУ) */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="relative flex items-center justify-center"
        style={{ width: dimensions.icon, height: dimensions.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full transform transition-transform duration-500 group-hover:rotate-12"
          fill="none"
          xmlns="http://w3.org"
        >
          {/* Задній захисний шар / Глибина знаку */}
          <path
            d="M15 25L50 85L85 25H15Z"
            className="fill-amber-500/10 dark:fill-amber-400/5 stroke-amber-500/20 dark:stroke-amber-400/10 stroke-[4]"
          />
          
          {/* Головна динамічна стріла / Елемент торгового хабу */}
          <motion.path
            d="M15 25L50 85L50 45L15 25Z"
            className="fill-amber-400 dark:fill-amber-500"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          
          {/* Праве крило знаку (Світлотінь) */}
          <motion.path
            d="M85 25L50 85L50 45L85 25Z"
            className="fill-amber-500 dark:fill-amber-600"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.1 }}
          />
          
          {/* Маленька іскорка розпродажу (Верхній акцент) */}
          <circle cx="50" cy="20" r="6" className="fill-rose-500 animate-pulse" />
        </svg>
      </motion.div>

      {/* ТЕКСТОВА ЧАСТИНА БРЕНДУ */}
      {showText && (
        <span className={`${dimensions.text} font-black tracking-tight text-gray-950 dark:text-white transition-colors duration-200`}>
          <span className="text-brand-accent dark:text-amber-400 transition-colors duration-300 group-hover:text-amber-300">
            Ukr
          </span>
          <span>TradeHub</span>
        </span>
      )}
    </Link>
  );
}

