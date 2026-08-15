import React from "react";
import { prisma } from "@/lib/prisma";
import { Settings, Sparkles } from "lucide-react";
import SettingsClient from "./SettingsClient";

export const revalidate = 0; // Налаштування завжди мають бути свіжими

async function getSystemSettings() {
  try {
    const config = await (prisma as any)['systemSettings'].findUnique({
      where: { id: "system_core_config" }
    });

    // Якщо база пуста, повертаємо дефолтні налаштування VelaMarket
    return config || {
      platformFee: 5.0,
      welcomeBonus: 150.0,
      maintenanceMode: false
    };
  } catch (error) {
    console.error("Помилка зчитування системних конфігурацій з Neon:", error);
    return {
      platformFee: 5.0,
      welcomeBonus: 150.0,
      maintenanceMode: false
    };
  }
}

export default async function AdminSettingsDashboard() {
  const currentSettings = await getSystemSettings();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 pb-20">
      
      {/* ПРЕМІАЛЬНА ШАПКА КОНФІГУРАТОРА */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#0b0f19] border-b border-slate-800/60 py-10 mb-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-400/20 text-amber-400 rounded-full text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" /> Central Core Configuration
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Settings className="w-8 h-8 text-amber-400" />
              Глобальні Налаштування <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Vela.Config</span>
            </h1>
            <p className="text-sm text-slate-400">Управління фінансовою архітектурою маркетплейсу, моніторинг розміру маржі та активація інженерного режиму обслуговування.</p>
          </div>
        </div>
      </div>

      {/* КЛІЄНТСЬКА КОНСОЛЬ НАЛАШТУВАНЬ */}
      <div className="container mx-auto px-4 max-w-7xl">
        <SettingsClient initialSettings={currentSettings} />
      </div>
    </div>
  );
}
