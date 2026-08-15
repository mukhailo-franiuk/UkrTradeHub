"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { updateProductStatusAction, deleteProductAdminAction } from "./actions";
import { Search, PackagePlus } from "lucide-react";
import ProductCard from "./ProductCard";
import AdminCreateModal from "./AdminCreateModal";

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

interface CategoryItem {
  id: string;
  name: string;
}

interface ProductsClientProps {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
}

export default function ProductsModernizationClient({ initialProducts, categories }: ProductsClientProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleUpdateStatus = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setUpdatingId(id);
    const res = await updateProductStatusAction(id, newStatus);
    if (res.success) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } else {
      alert(res.error);
    }
    setUpdatingId(null);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Ви впевнені, що хочете остаточно видалити лот "${title}"?`)) return;
    const res = await deleteProductAdminAction(id);
    if (res.success) {
      setProducts(prev => prev.filter(p => p.id !== id));
    } else {
      alert(res.error);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.brand.toLowerCase().includes(search.toLowerCase()) || 
                          p.shopName.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "MODERATION") return matchesSearch && p.status === "MODERATION";
    if (filter === "APPROVED") return matchesSearch && p.status === "APPROVED";
    if (filter === "REJECTED") return matchesSearch && p.status === "REJECTED";
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* ВЕРХНІЙ ТУЛБАР: ПОШУК ТА ФІЛЬТРИ */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#111827]/20 p-4 border border-slate-800/60 rounded-2xl">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Шукати за назвою, брендом або магазином..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 transition-colors font-medium"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-950/60 border border-slate-800 text-slate-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-400/60 cursor-pointer font-bold"
          >
            <option value="ALL">Усі товари платформи</option>
            <option value="MODERATION">На перевірці</option>
            <option value="APPROVED">Активні лоти</option>
            <option value="REJECTED">Заблоковані</option>
          </select>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <PackagePlus className="w-4 h-4 stroke-[2.5]" />
            Додати товар
          </button>
        </div>
      </div>

      {/* СІТКА КАРТОК ТОВАРІВ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              updatingId={updatingId}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* МОДАЛКА СТВОРЕННЯ */}
      <AnimatePresence>
        <AdminCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          categories={categories}
        />
      </AnimatePresence>

    </div>
  );
}
