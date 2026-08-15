'use client'

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  LayoutDashboard,
  Store,
  Users,
  ShoppingBag,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  ShieldCheck,
  FolderTree,
  BarChart3,
  Database
} from "lucide-react";

const adminNavItems = [
  { href: "/dashboard/admin", label: "Головна панель", icon: LayoutDashboard },
  { href: "/dashboard/admin/products", label: "Модерація товарів", icon: ShoppingBag },
  { href: "/dashboard/admin/categories", label: "Каталог категорій", icon: FolderTree },
  { href: "/dashboard/admin/shops", label: "Керування магазинами", icon: Store },
  { href: "/dashboard/admin/users", label: "База користувачів", icon: Users },
  { href: "/dashboard/admin/analytics", label: "Фінансова аналітика", icon: BarChart3 },
  { href: "/dashboard/admin/logs", label: "Системні логи БД", icon: Database },
  { href: "/dashboard/admin/settings", label: "Налаштування платформи", icon: Settings },
];

const sidebarVariants: Variants = {
  open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
};

const containerVariants: Variants = {
  open: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
  closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } }
};

const itemVariants: Variants = {
  open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  closed: { opacity: 0, y: 15, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMobileMenu = () => setIsOpen(!isOpen);
  const toggleDesktopCollapse = () => setIsCollapsed(!isCollapsed);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.refresh();
      window.location.href = '/login';
    } catch (err) {
      console.error("Помилка при виході:", err);
    }
  };

  return (
    <>
      {/* --- МОБІЛЬНИЙ ХЕДЕР АДМІНА --- */}
      <header className="lg:hidden fixed top-30 left-0 right-0 h-16 bg-[#0f172a] border-b border-slate-800/80 flex items-center justify-between px-4 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span className="font-black text-lg tracking-tight text-white uppercase font-mono">
            Vela.<span className="text-amber-400">Admin</span>
          </span>
        </div>
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-slate-400 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
        >
          {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </header>

      {/* --- МОБІЛЬНА ШТОРКА НАВІГАЦІЇ --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="lg:hidden fixed inset-0 bg-black z-40"
            />

            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-[#0f172a] border-r border-slate-800/60 text-white z-50 p-6 flex flex-col justify-between shadow-2xl"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-amber-400" />
                    <span className="font-black text-xl tracking-tight text-white uppercase font-mono">Vela.<span className="text-amber-400">HQ</span></span>
                  </div>
                  <button onClick={toggleMobileMenu} className="p-1.5 text-slate-400 hover:bg-slate-800 rounded-lg cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <motion.nav variants={containerVariants} className="space-y-1">
                  {adminNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.div variants={itemVariants} key={item.href}>
                        <Link
                          href={item.href}
                          onClick={toggleMobileMenu}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                            ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                          <item.icon className={`w-5 h-5 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
                          {item.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.nav>
              </div>

              <div className="pt-4 border-t border-slate-800/60">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Вийти з системи
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- ДЕСКТОПНИЙ ВЕЛИКИЙ САЙДБАР --- */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="hidden lg:flex fixed top-0 left-0 bottom-0 bg-[#0f172a] border-r border-slate-800/60 p-4 flex-col justify-between z-30 shadow-xl text-white"
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2 h-10 border-b border-slate-800/60 pb-4">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2 font-black text-lg tracking-wider text-white uppercase whitespace-nowrap font-mono"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Vela.<span className="text-amber-400">Admin</span> 👑</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={toggleDesktopCollapse}
              className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:bg-white/5 hover:text-white ml-auto transition-colors cursor-pointer"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium relative group transition-all ${isActive
                      ? "text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="adminActiveIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl -z-10 shadow-lg shadow-amber-500/10 border-l-4 border-amber-300"
                      // ВИПРАВЛЕНО: міняємо тип зі spring на стабільний easeOut для запобігання крашу keyframes
                      transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
                    />
                  )}

                  <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? "text-slate-950" : "text-slate-400 group-hover:text-white"
                    }`} />

                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        // ВИПРАВЛЕНО: забираємо spring і фіксуємо лінійний вхід тексту без помилок
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                        transition={{ ease: "easeInOut", duration: 0.15 }}
                        className="truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Спливаюча підказка (Tooltip) при згорнутому стані */}
                  {isCollapsed && (
                    <div className="absolute left-20 bg-slate-950 text-white text-xs font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 border border-slate-800 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-50 shadow-2xl">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* КНОПКА ВИХОДУ ВНИЗУ */}
        <div className="pt-4 border-t border-slate-800/60">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-3 text-sm font-medium text-rose-400 hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer group"
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  Вийти з системи
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}


