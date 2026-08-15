import React from "react";
import { prisma } from "@/lib/prisma";
import { Terminal, Sparkles } from "lucide-react";
import LogsClient from "./LogsClient";

export const revalidate = 0; // Завжди свіжий стрім логів ядра

async function getSystemLogsData() {
  try {
    const transactions = await (prisma as any)['transaction'].findMany({
  orderBy: { createdAt: "desc" },
  take: 30, //  Правильний аргумент для обмеження кількості записів
  include: {
    user: { select: { email: true } }
  }
});

    return transactions.map((t: any) => {
      const email = t.user?.email || "system.core";
      const isBonus = t.type === "CASHBACK";
      
      return {
        id: t.id,
        type: isBonus ? "AUTH" : "SYSTEM",
        message: isBonus 
          ? `Успішна авторизація системи. Створено гаманець, активовано бонус +${t.amount} ₴ [VelaAuth]`
          : `Фінансова трансакція ядра: ${t.description || "Оновлення балансу маркету"}`,
        userEmail: email,
        ipAddress: "127.0.0.1",
        createdAt: new Date(t.createdAt).toLocaleTimeString("uk-UA", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }) + ` ${new Date(t.createdAt).toLocaleDateString("uk-UA")}`
      };
    });
  } catch (error) {
    console.error("Помилка підключення до ядра терміналу логів Neon:", error);
    return [];
  }
}

export default async function AdminLogsDashboard() {
  const logs = await getSystemLogsData();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 pb-20">
      
      {/* ПРЕМІАЛЬНА ШАПКА ТЕРМІНАЛУ */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#0b0f19] border-b border-slate-800/60 py-10 mb-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-400/20 text-amber-400 rounded-full text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" /> Admin Core Output
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Terminal className="w-8 h-8 text-amber-400" />
              Моніторинг Системи <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Vela.Logs</span>
            </h1>
            <p className="text-sm text-slate-400">Аудит операцій платформи в реальному часі, фіксація точок входу та автоматичний моніторинг сесій клієнтів.</p>
          </div>
        </div>
      </div>

      {/* ІНТЕРАКТИВНИЙ КЛІЄНТСЬКИЙ ТЕРМІНАЛ */}
      <div className="container mx-auto px-4 max-w-7xl">
        <LogsClient initialLogs={logs} />
      </div>
    </div>
  );
}
