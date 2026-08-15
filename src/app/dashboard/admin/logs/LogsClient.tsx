"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clearSystemLogsAction } from "./actions";
import { 
  Search, Terminal, Trash2, ShieldAlert, 
  CheckCircle2, Info, RefreshCw, Filter, UserCheck 
} from "lucide-react";

interface LogItem {
  id: string;
  type: string;
  message: string;
  userEmail: string;
  ipAddress: string;
  createdAt: string;
}

interface LogsClientProps {
  initialLogs: LogItem[];
}

export default function LogsClient({ initialLogs }: LogsClientProps) {
  const [logs, setLogs] = useState<LogItem[]>(initialLogs);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [isClearing, setIsClearing] = useState(false);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "AUTH") return matchesSearch && log.type === "AUTH";
    if (filter === "SYSTEM") return matchesSearch && log.type === "SYSTEM";
    return matchesSearch;
  });

  const handleClearLogs = async () => {
    if (!confirm("Ви впевнені, що хочете очистити системні записи?")) return;
    setIsClearing(true);
    const res = await clearSystemLogsAction();
    if (res.success) {
      setLogs([]);
    }
    setIsClearing(false);
  };

  return (
    <div className="space-y-6">
      
      {/* КЕРУВАННЯ ТА ФІЛЬТРИ */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Пошук за логом або email користувача..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111827]/60 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#111827]/60 border border-slate-800 text-slate-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400/60 cursor-pointer"
          >
            <option value="ALL">Усі системні події</option>
            <option value="AUTH">Логи авторизації (Сесії)</option>
            <option value="SYSTEM">Критичні дії оператора</option>
          </select>

          <button
            onClick={handleClearLogs}
            disabled={isClearing}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-rose-500/30 text-rose-400 bg-rose-500/5 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Очистити
          </button>
        </div>
      </div>

      {/* КОНСОЛЬ СИСТЕМНИХ ЗАПИСІВ */}
      <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-2xl shadow-2xl p-6 font-mono overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
            <Terminal className="w-4 h-4 text-amber-400" /> Live Stream Output
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto space-y-2.5 pr-2">
          <AnimatePresence mode="popLayout">
            {filteredLogs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-slate-600 text-xs italic"
              >
                Нових записів у терміналі ядра не зафіксовано.
              </motion.div>
            ) : (
              filteredLogs.map((log) => {
                const isAuth = log.type === "AUTH";
                return (
                  <motion.div
                    key={log.id}
                    layout
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
                    className="p-3 bg-[#111827]/40 border border-slate-800/40 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs hover:border-slate-800 transition-colors"
                  >
                    <div className="flex items-start md:items-center gap-3">
                      {isAuth ? (
                        <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md shrink-0"><UserCheck className="w-3.5 h-3.5" /></div>
                      ) : (
                        <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md shrink-0"><Info className="w-3.5 h-3.5" /></div>
                      )}
                      <div>
                        <p className="text-slate-300 font-medium leading-relaxed">{log.message}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Оператор: <strong className="text-slate-400">{log.userEmail}</strong> • IP: <span className="text-slate-500">{log.ipAddress}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap self-end md:self-center">{log.createdAt}</span>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
