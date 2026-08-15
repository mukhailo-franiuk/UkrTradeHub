"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateUserRoleAction } from "./actions";
import {
  Search, ShieldAlert, User, Store,
  Coins, Filter, CheckCircle2, AlertCircle
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "VENDOR" | "BUYER";
  balanceUah: number;
  createdAt: string;
}

interface UserTableProps {
  initialUsers: UserItem[];
}

export default function UserTable({ initialUsers }: UserTableProps) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Фільтрація та пошук користувачів на клієнті в реальному часі
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: "ADMIN" | "VENDOR" | "BUYER") => {
    setUpdatingId(userId);
    const res = await updateUserRoleAction(userId, newRole);
    if (res.success) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
    setUpdatingId(null);
  };

  const roleStyles = {
    ADMIN: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    VENDOR: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    BUYER: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
  };

  return (
    <div className="space-y-6">
      {/* ПАНЕЛЬ ФІЛЬТРІВ ТА ПОШУКУ */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Пошук за іменем або email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111827]/60 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#111827]/60 border border-slate-800 text-slate-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400/60 cursor-pointer"
          >
            <option value="ALL">Усі ролі</option>
            <option value="ADMIN">Адміністратори</option>
            <option value="VENDOR">Продавці (Вендори)</option>
            <option value="BUYER">Покупці</option>
          </select>
        </div>
      </div>

      {/* ТАБЛИЦЯ КОРИСТУВАЧІВ */}
      <div className="bg-[#111827]/40 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a] text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-800/60">
                <th className="px-6 py-4">Користувач / Акаунт</th>
                <th className="px-6 py-4">Права (Роль)</th>
                <th className="px-6 py-4">Поточний Баланс</th>
                <th className="px-6 py-4">Дата реєстрації</th>
                <th className="px-6 py-4 text-right">Змінити рівень доступу</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              <AnimatePresence mode="popLayout">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-16 text-center text-slate-500 text-sm">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                      Користувачів за вказаними фільтрами не знайдено.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-[#111827]/50 transition-colors duration-200 group"
                    >
                      {/* КОРИСТУВАЧ */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center font-bold text-white border border-slate-700 font-mono">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-amber-400 transition-colors">{user.name}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* РОЛЬ */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${roleStyles[user.role]}`}>
                          {user.role === "ADMIN" && <ShieldAlert className="w-3 h-3" />}
                          {user.role === "VENDOR" && <Store className="w-3 h-3" />}
                          {user.role === "BUYER" && <User className="w-3 h-3" />}
                          {user.role}
                        </span>
                      </td>

                      {/* БАЛАНС */}
                      <td className="px-6 py-4 font-mono font-bold">
                        <div className="flex items-center gap-1.5 text-white">
                          <Coins className={`w-4 h-4 ${user.balanceUah > 0 ? "text-amber-400" : "text-slate-600"}`} />
                          <span>{user.balanceUah.toLocaleString("uk-UA", { minimumFractionDigits: 2 })} ₴</span>
                          {user.balanceUah === 150 && (
                            <span className="text-[10px] bg-amber-400/10 text-amber-400 border border-amber-400/20 px-1.5 py-0.5 rounded font-sans font-medium">Бонус</span>
                          )}
                        </div>
                      </td>

                      {/* ДАТА */}
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        {user.createdAt}
                      </td>

                      {/* СЕЛЕКТ ЗМІНИ РОЛІ */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {updatingId === user.id ? (
                            <span className="text-xs font-bold text-amber-400 tracking-wider uppercase animate-pulse">Збереження...</span>
                          ) : user.role === "ADMIN" ? (
                            // Якщо користувач адмін, замість селекту виводимо заблокований індикатор безпеки
                            <span className="text-xs font-black text-amber-500/60 uppercase tracking-widest font-mono bg-amber-500/5 px-2.5 py-1.5 rounded-lg border border-amber-500/20 shadow-inner select-none">
                              🔒 Система
                            </span>
                          ) : (
                            // Для BUYER та VENDOR селект залишається активним
                            <select
                              value={user.role}
                              disabled={updatingId !== null}
                              onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                              className="bg-[#0f172a] border border-slate-800 text-xs text-slate-300 font-bold uppercase tracking-wider rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-400/60 cursor-pointer hover:border-slate-700 transition-colors"
                            >
                              <option value="BUYER">BUYER</option>
                              <option value="VENDOR">VENDOR</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          )}
                        </div>
                      </td>

                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
