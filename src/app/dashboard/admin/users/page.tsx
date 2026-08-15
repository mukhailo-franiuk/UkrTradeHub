import React from "react";
import { prisma } from "@/lib/prisma";
import { ShieldCheck, Sparkles, Users } from "lucide-react";
import UserTable from "./UserTable";

export const revalidate = 0; // Дані завжди свіжі з бази, без кешування

async function getUsersData() {
  try {
    const rawUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        balanceUah: true,
        createdAt: true
      }
    });

    return rawUsers.map(user => ({
      id: user.id,
      name: user.name || "Без імені",
      email: user.email,
      role: user.role as "ADMIN" | "VENDOR" | "BUYER",
      balanceUah: Number(user.balanceUah),
      createdAt: user.createdAt.toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    }));
  } catch (error) {
    console.error("Помилка завантаження бази користувачів:", error);
    return [];
  }
}

export default async function AdminUsersDashboard() {
  const users = await getUsersData();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 pb-20">
      {/* ПРЕМІАЛЬНА ШАПКА ЕКРАНУ */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#0b0f19] border-b border-slate-800/60 py-10 mb-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" /> Users Management Matrix
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-amber-400" />
              База Користувачів <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Vela.Registry</span>
            </h1>
            <p className="text-sm text-slate-400">Глобальний перегляд профілів, моніторинг гаманців, балансів та експрес-управління ролями.</p>
          </div>
        </div>
      </div>

      {/* ІНТЕРАКТИВНА СЕКЦІЯ ТАБЛИЦІ */}
      <div className="container mx-auto px-4 max-w-7xl">
        <UserTable initialUsers={users} />
      </div>
    </div>
  );
}
