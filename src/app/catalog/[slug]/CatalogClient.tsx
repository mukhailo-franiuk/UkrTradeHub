"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SlidersHorizontal, ArrowUpDown, ChevronDown, Check } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  slug: string;
  imageUrl: string;
}

interface CatalogClientProps {
  initialProducts: Product[];
}

type SortOption = "default" | "price-asc" | "price-desc" | "title-asc";

export default function CatalogClient({ initialProducts = [] }: CatalogClientProps) {
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Автоматичний розрахунок меж цін для плейсхолдерів
  const { absoluteMin, absoluteMax } = useMemo(() => {
    if (!initialProducts || initialProducts.length === 0) return { absoluteMin: 0, absoluteMax: 0 };
    const prices = initialProducts.map((p) => Number(p.price) || 0);
    return {
      absoluteMin: Math.min(...prices),
      absoluteMax: Math.max(...prices),
    };
  }, [initialProducts]);

  // Конвеєр фільтрації
  const processedProducts = useMemo(() => {
    if (!initialProducts || initialProducts.length === 0) return [];
    let result = [...initialProducts];

    if (minPrice !== "") {
      result = result.filter((p) => Number(p.price) >= Number(minPrice));
    }
    if (maxPrice !== "") {
      result = result.filter((p) => Number(p.price) <= Number(maxPrice));
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "title-asc") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return result;
  }, [initialProducts, sortBy, minPrice, maxPrice]);

  const sortOptionsLabels: Record<SortOption, string> = {
    default: "За замовчуванням",
    "price-asc": "Ціна: від дешевих до дорожчих",
    "price-desc": "Ціна: від дорожчих до дешевих",
    "title-asc": "Назва: від А до Я",
  };

  return (
    <div className="space-y-6">
      
      {/* ВЕРХНЯ ПАНЕЛЬ ФІЛЬТРІВ */}
      <div className="bg-[#111827]/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Блок ціни */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="p-2 bg-slate-950 rounded-xl border border-slate-900 shrink-0 text-amber-400">
            <SlidersHorizontal size={14} />
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono">Ціна (₴):</span>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder={`від ${absoluteMin}`}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-24 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400 transition-colors"
            />
            <span className="text-slate-600 font-mono text-xs">—</span>
            <input
              type="number"
              placeholder={`до ${absoluteMax}`}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-24 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {(minPrice !== "" || maxPrice !== "") && (
            <button
              onClick={() => { setMinPrice(""); setMaxPrice(""); }}
              className="text-[10px] font-bold text-rose-400 hover:text-rose-300 font-mono cursor-pointer underline ml-2"
            >
              Скинути
            </button>
          )}
        </div>

        {/* Дропдаун сортування */}
        <div className="relative shrink-0">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="w-full md:w-64 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center justify-between gap-2 cursor-pointer transition-all"
          >
            <span className="line-clamp-1">{sortOptionsLabels[sortBy]}</span>
            <ChevronDown size={14} className="text-slate-500" />
          </button>

          {isSortDropdownOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setIsSortDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-full md:w-64 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-1 z-30 overflow-hidden">
                {(Object.keys(sortOptionsLabels) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-left text-xs font-bold transition-colors ${
                      sortBy === option ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <span>{sortOptionsLabels[option]}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

      </div>

      {/* КІЛЬКІСТЬ */}
      <div className="flex justify-between items-center px-1">
        <p className="text-[11px] text-slate-500 font-mono">
          Показано товарів: <span className="text-slate-300 font-bold">{processedProducts.length}</span> з {initialProducts.length}
        </p>
      </div>

      {/* СІТКА ТОВАРІВ */}
      {processedProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#111827]/10 border border-dashed border-slate-800/80 rounded-2xl p-6 max-w-sm mx-auto">
          <span className="text-3xl block mb-2">🔍</span>
          <h4 className="text-sm font-bold text-slate-400 mb-1">Товарів не знайдено</h4>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {processedProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-[#111827]/40 border border-slate-800/80 rounded-2xl p-3 flex flex-col justify-between group relative overflow-hidden transition-all hover:border-slate-700/60"
            >
              <Link href={`/products/${product.slug}`} className="space-y-3 flex-1 flex flex-col">
                <div className="w-full aspect-square bg-slate-950 rounded-xl border border-slate-900/60 flex items-center justify-center overflow-hidden p-2">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.title} 
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <div className="space-y-1 flex-1 flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-slate-200 line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs font-mono font-black text-amber-400 pt-1">
                    {product.price} ₴
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
