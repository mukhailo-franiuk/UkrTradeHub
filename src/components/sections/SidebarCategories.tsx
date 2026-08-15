"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, ChevronRight, Sparkles, Folder } from "lucide-react";

interface SidebarCategoryItem {
  name: string;
  href: string;
  imageUrl: string | null;
}

interface SidebarCategoriesProps {
  serverCategories: SidebarCategoryItem[];
}

// Конфігурація плавного лінійного ковзання повзунка фону
const sidebarBgTransition = { type: "tween", ease: "easeOut", duration: 0.18 } as const;

export default function SidebarCategories({ serverCategories }: SidebarCategoriesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <aside className="hidden lg:block bg-[#0f172a]/60 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-800/80 h-fit sticky top-24 max-w-[280px] w-full">
      
      {/* ЗАГОЛОВОК КАТАЛОГУ */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-2.5">
        <h2 className="font-black text-sm text-white uppercase flex items-center gap-2.5 tracking-wider select-none font-mono">
          <Menu size={16} className="text-amber-400" /> 
          Каталог товарів
        </h2>
        <Sparkles size={14} className="text-amber-400 animate-pulse" />
      </div>

      {/* НАВІГАЦІЙНИЙ СПИСОК ІЗ КІНЕМАТОГРАФІЧНИМ ФОНОМ */}
      <nav className="relative space-y-1" onMouseLeave={() => setHoveredIndex(null)}>
        {serverCategories.map((cat, idx) => {
          const isHovered = hoveredIndex === idx;

          return (
            <Link
              key={idx}
              href={cat.href}
              onMouseEnter={() => setHoveredIndex(idx)}
              className="relative flex items-center justify-between p-2 rounded-xl text-slate-300 transition-colors duration-200 text-xs font-bold group/item cursor-pointer"
            >
              {/* ПЛАВАЮЧИЙ НЕОНОВИЙ ФОН ПРИ ХОВЕРІ */}
              {isHovered && (
                <motion.span
                  layoutId="sidebarHoverBg"
                  transition={sidebarBgTransition}
                  className="absolute inset-0 bg-amber-500/10 rounded-xl border border-amber-500/5"
                />
              )}

              {/* ЛІВА ЧАСТИНА: МАНЮСІНЬКА КАРТИНКА BLOB + НАЗВА */}
              <div className="flex items-center gap-3 relative z-10 overflow-hidden flex-1 pr-2">
                <motion.div
                  animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
                  className={`w-7 h-7 rounded-lg border shrink-0 flex items-center justify-center overflow-hidden transition-colors ${
                    isHovered ? "border-amber-400/40 bg-amber-400/5" : "border-slate-800 bg-slate-950"
                  }`}
                >
                  {cat.imageUrl ? (
                    <img 
                      src={cat.imageUrl} 
                      alt={cat.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    // Преміальний текстовий фолбек, якщо картинку не завантажили в адмінці
                    <span className="text-[10px] font-black font-mono text-amber-400 uppercase">
                      {cat.name.charAt(0)}
                    </span>
                  )}
                </motion.div>
                
                <span className="transition-colors duration-150 group-hover/item:text-amber-400 tracking-tight truncate py-0.5">
                  {cat.name}
                </span>
              </div>

              {/* ПРАВА ЧАСТИНА: ІНТЕРАКТИВНА СТРІЛОЧКА */}
              <div className="relative z-10 shrink-0">
                <ChevronRight 
                  size={12} 
                  className="text-slate-600 group-hover/item:text-amber-400 transform group-hover/item:translate-x-0.5 transition-all duration-200" 
                />
              </div>

            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
