"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { exportFinancialReportAction } from "./actions";
import { 
  TrendingUp, Coins, ShieldCheck, Download, 
  ArrowUpRight, ArrowDownLeft, Clock, DollarSign 
} from "lucide-react";

interface AnalyticsClientProps {
  stats: {
    totalGmv: number;
    platformRevenue: number;
    distributedCashback: number;
    activeWalletVolume: number;
  };
  recentTransactions: Array<{
    id: string;
    userName: string;
    userEmail: string;
    amount: number;
    type: string;
    description: string;
    createdAt: string;
  }>;
}

export default function AnalyticsClient({ stats, recentTransactions }: AnalyticsClientProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleCsvExport = async () => {
    setIsExporting(true);
    const res = await exportFinancialReportAction();
    
    if (res.success && res.data && res.filename) {
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", res.filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Помилка під час експорту даних.");
    }
    setIsExporting(false);
  };

  return (
    <div className="space-y-8">
      
      {/* КНОПКА ЕКСПОРТУ ЗВІТІВ */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCsvExport}
          disabled={isExporting}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-amber-400/30 text-slate-900 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg cursor-pointer transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          {isExporting ? "Експорт..." : "Завантажити фінансовий звіт CSV"}
        </motion.button>
      </div>

      {/* МАТРИЦЯ ГОЛОВНИХ ФІНАНСОВИХ МЕТРИК */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* ОБОРОТ GMV */}
        <div className="bg-[#111827]/40 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex items-center justify-between relative overflow-hidden group">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Торговий оборот (GMV)</p>
            <p className="mt-2 text-2xl font-black text-white font-mono tracking-tight">
              {stats.totalGmv.toLocaleString("uk-UA", { minimumFractionDigits: 2 })} <span className="text-sm font-bold text-amber-400">₴</span>
            </p>
          </div>
          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-blue-400"><TrendingUp className="w-5 h-5" /></div>
        </div>

        {/* ЧИСТИЙ ДОХІД ПЛАТФОРМИ */}
        <div className="bg-[#111827]/40 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex items-center justify-between relative overflow-hidden group">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Дохід від комісій (5%)</p>
            <p className="mt-2 text-2xl font-black text-emerald-400 font-mono tracking-tight">
              +{stats.platformRevenue.toLocaleString("uk-UA", { minimumFractionDigits: 2 })} <span className="text-sm font-bold">₴</span>
            </p>
          </div>
          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-emerald-400"><DollarSign className="w-5 h-5" /></div>
        </div>

        {/* РОЗПОДІЛЕНИЙ БОНУС */}
        <div className="bg-[#111827]/40 border border-amber-500/10 p-5 rounded-2xl shadow-xl flex items-center justify-between relative overflow-hidden group">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Активовано Бонусів 150₴</p>
            <p className="mt-2 text-2xl font-black text-amber-400 font-mono tracking-tight">
              {stats.distributedCashback.toLocaleString("uk-UA")} <span className="text-sm font-bold">₴</span>
            </p>
          </div>
          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-amber-500/20 text-amber-400"><Coins className="w-5 h-5" /></div>
        </div>

        {/* ОБ'ЄМ НА ГАМАНЦЯХ */}
        <div className="bg-[#111827]/40 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex items-center justify-between relative overflow-hidden group">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Капітал на гаманцях</p>
            <p className="mt-2 text-2xl font-black text-indigo-400 font-mono tracking-tight">
              {stats.activeWalletVolume.toLocaleString("uk-UA", { minimumFractionDigits: 2 })} <span className="text-sm font-bold">₴</span>
            </p>
          </div>
          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-indigo-400"><ShieldCheck className="w-5 h-5" /></div>
        </div>
      </div>

      {/* ТАБЛИЦЯ ОСТАННІХ ТРАНСАКЦІЙ */}
      <div className="bg-[#111827]/40 border border-slate-800/80 rounded-2xl shadow-xl p-6">
        <div className="border-b border-slate-800/60 pb-4 flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-amber-400" />
          <h2 className="text-base font-black text-white uppercase tracking-wider">Стрічка фінансової активності (Останні зміни)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a] text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-800/60">
                <th className="px-4 py-3">Користувач / Призначення</th>
                <th className="px-4 py-3">Тип запису</th>
                <th className="px-4 py-3">Призначення / Лог</th>
                <th className="px-4 py-3">Дата операції</th>
                <th className="px-4 py-3 text-right">Сума операції</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs text-slate-300">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">Фінансових трансакцій у базі даних не знайдено.</td>
                </tr>
              ) : (
                recentTransactions.map((tx) => {
                  const isPositive = tx.type === "CASHBACK" || tx.type === "DEPOSIT" || tx.amount > 0;
                  return (
                    <tr key={tx.id} className="hover:bg-[#111827]/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-white">{tx.userName}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{tx.userEmail}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          isPositive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          {isPositive ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownLeft className="w-2.5 h-2.5" />}
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 italic font-medium">{tx.description}</td>
                      <td className="px-4 py-3.5 font-mono text-slate-500">{tx.createdAt}</td>
                      <td className={`px-4 py-3.5 text-right font-mono font-black text-sm ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                        {isPositive ? "+" : ""}{Number(tx.amount).toLocaleString("uk-UA", { minimumFractionDigits: 2 })} ₴
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
