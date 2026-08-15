"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateSystemSettingsAction } from "./actions";
import { Settings, Percent, Wallet, ShieldAlert, CheckCircle2, Save, RefreshCw } from "lucide-react";

interface SettingsProps {
  initialSettings: {
    platformFee: number;
    welcomeBonus: number;
    maintenanceMode: boolean;
  };
}

export default function SettingsClient({ initialSettings }: SettingsProps) {
  const [fee, setFee] = useState(initialSettings.platformFee);
  const [bonus, setBonus] = useState(initialSettings.welcomeBonus);
  const [maintenance, setMaintenance] = useState(initialSettings.maintenanceMode);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("platformFee", fee.toString());
    formData.append("welcomeBonus", bonus.toString());
    formData.append("maintenanceMode", maintenance.toString());

    const res = await updateSystemSettingsAction(formData);
    
    if (res.success) {
      setStatus({ success: true, msg: "Системну конфігурацію Vela.Core успішно оновлено!" });
      setTimeout(() => setStatus(null), 4000);
    } else {
      setStatus({ success: false, msg: res.error || "Помилка синхронізації з ядром" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* КАРТКА ФІНАНСОВИХ НАЛАШТУВАНЬ */}
        <div className="bg-[#111827]/40 border border-slate-800/80 p-6 rounded-2xl shadow-xl space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
            <Settings className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono">Фінансові змінні платформи</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Комісія маркетплейсу */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-amber-400" /> Комісія платформи з продажів
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={fee}
                  onChange={(e) => setFee(parseFloat(e.target.value) || 0)}
                  className="w-full pl-4 pr-12 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-200 font-mono focus:outline-none focus:border-amber-400/60 transition-colors font-medium"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 font-mono">%</span>
              </div>
              <p className="text-[10px] text-slate-500 italic">Стягується автоматично з вендора при успішному виконанні замовлення.</p>
            </div>

            {/* Вітальний бонус */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-amber-400" /> Вітальний бонус новим клієнтам
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="5"
                  min="0"
                  value={bonus}
                  onChange={(e) => setBonus(parseFloat(e.target.value) || 0)}
                  className="w-full pl-4 pr-12 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-200 font-mono focus:outline-none focus:border-amber-400/60 transition-colors font-medium"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 font-mono">₴</span>
              </div>
              <p className="text-[10px] text-slate-500 italic">Сума стартового кешбеку, яка нараховується відразу після реєстрації аккаунта.</p>
            </div>
          </div>
        </div>

        {/* КАРТКА ТЕХНІЧНОГО СТАНУ ПЛАТФОРМИ */}
        <div className={`border p-6 rounded-2xl shadow-xl transition-all duration-300 ${
          maintenance 
            ? "bg-rose-500/5 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.05)]" 
            : "bg-[#111827]/40 border-slate-800/80"
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className={`w-4 h-4 ${maintenance ? "text-rose-400 animate-pulse" : "text-amber-400"}`} />
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono">Режим технічного обслуговування</h2>
            </div>
            
            {/* ПРЕМІАЛЬНИЙ КЛІЄНТСЬКИЙ TOGGLE ПЕРЕМИКАЧ */}
            <button
              type="button"
              onClick={() => setMaintenance(!maintenance)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer border ${
                maintenance ? "bg-rose-500 border-rose-400" : "bg-slate-900 border-slate-800"
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                maintenance ? "translate-x-5" : "translate-x-0"
              }`} />
            </button>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed space-y-1">
            <p>Коли цей перемикач активовано, публічна вітрина маркетплейсу, каталог товарів та кошик закриваються для звичайних покупців.</p>
            <p className={`${maintenance ? "text-rose-400 font-bold" : "text-slate-500"} transition-colors`}>
              • Статус: {maintenance ? "ВКЛЮЧЕНО. Користувачі побачать екран тех-обслуговування [503 Maintenance]." : "ВИКЛЮЧЕНО. Маркетплейс Vela працює в штатному режимі."}
            </p>
          </div>
        </div>

        {/* СТАТУС-ПОВІДОМЛЕННЯ (Анімоване через tween) */}
        <AnimatePresence mode="popLayout">
          {status && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "tween", duration: 0.15 }}
              className={`p-4 border rounded-xl text-xs flex items-center gap-2 ${
                status.success 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-medium">{status.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* КНОПКА ЗБЕРЕЖЕННЯ */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.1)] cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Синхронізація ядра...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 stroke-[2.5]" />
                Зберегти конфігурацію
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
