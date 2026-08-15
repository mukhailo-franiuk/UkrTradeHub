"use client";

import React from "react";
import { motion } from "framer-motion";
import { Store, Box, ShoppingBag, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";

interface ProductItem {
  id: string;
  title: string;
  brand: string;
  status: string;
  isHotDeal: boolean;
  isFeatured: boolean;
  shopName: string;
  mainImageUrl: string | null;
  price: number;
  discount: number;
  stock: number;
}

interface ProductCardProps {
  product: ProductItem;
  updatingId: string | null;
  onUpdateStatus: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  onDelete: (id: string, title: string) => void;
}

export default function ProductCard({ product, updatingId, onUpdateStatus, onDelete }: ProductCardProps) {
  const isMod = product.status === "MODERATION";
  const isApp = product.status === "APPROVED";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#111827]/40 border border-slate-800/80 hover:border-slate-700/60 rounded-2xl p-4 shadow-xl flex flex-col justify-between gap-4 group transition-all"
    >
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
            isApp ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
            isMod ? "bg-amber-500/10 border-amber-400/20 text-amber-400 animate-pulse" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}>{product.status}</span>
          {product.discount > 0 && <span className="bg-rose-500 text-white font-mono text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm">-{product.discount}%</span>}
        </div>

        <div className="flex gap-3 items-start">
          <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
            {product.mainImageUrl ? <img src={product.mainImageUrl} alt={product.title} className="w-full h-full object-cover" /> : <ShoppingBag className="w-5 h-5 text-slate-700" />}
          </div>
          <div className="overflow-hidden flex-1 space-y-1">
            <span className="inline-block text-[9px] font-bold text-amber-400 uppercase tracking-wider font-mono bg-slate-900 border border-slate-800 px-1.5 rounded">{product.brand}</span>
            <h3 className="font-extrabold text-white text-xs line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">{product.title}</h3>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-800/40 grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-medium">
          <div className="flex items-center gap-1.5 truncate"><Store className="w-3.5 h-3.5 text-slate-600 shrink-0" /><span className="truncate text-slate-300">{product.shopName}</span></div>
          <div className="flex items-center gap-1.5 justify-end"><Box className="w-3.5 h-3.5 text-slate-600 shrink-0" /><span>Склад: <strong className="text-slate-200 font-mono">{product.stock} шт</strong></span></div>
        </div>

        <div className="pt-2 flex items-baseline gap-1 text-sm font-mono font-black text-amber-400">
          <span className="text-[10px] font-bold text-slate-500 mr-0.5">від</span>{Number(product.price).toLocaleString("uk-UA", { minimumFractionDigits: 2 })} <span className="text-xs font-bold text-slate-300">₴</span>
        </div>
      </div>

      <div className="pt-1 grid grid-cols-2 gap-2">
        {updatingId === product.id ? (
          <div className="col-span-2 py-2 bg-slate-900/40 border border-slate-800 rounded-xl text-center text-[9px] font-black text-amber-400 uppercase tracking-widest animate-pulse font-mono">Синхронізація лоту...</div>
        ) : (
          <>
            {isApp ? (
              <button type="button" onClick={() => onUpdateStatus(product.id, "REJECTED")} className="inline-flex items-center justify-center gap-1 px-3 py-2 border border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm"><ShieldAlert className="w-3 h-3" /> Блокувати</button>
            ) : (
              <button type="button" onClick={() => onUpdateStatus(product.id, "APPROVED")} className="inline-flex items-center justify-center gap-1 px-3 py-2 border border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm"><ShieldCheck className="w-3 h-3" /> Схвалити</button>
            )}
            <button type="button" onClick={() => onDelete(product.id, product.title)} className="inline-flex items-center justify-center gap-1 px-3 py-2 border border-slate-800 bg-slate-950/40 text-slate-500 hover:text-rose-400 hover:border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"><Trash2 className="w-3 h-3" /> Видалити</button>
          </>
        )}
      </div>
    </motion.div>
  );
}
