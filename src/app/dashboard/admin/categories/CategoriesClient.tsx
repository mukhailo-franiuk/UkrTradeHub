"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createCategoryAction, deleteCategoryAction, updateCategoryAction } from "./actions";
import {
  FolderPlus, Trash2, Tag, Search, AlertCircle, Plus,
  CornerDownRight, Edit3, X, FolderTree, Info, HelpCircle
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  base64Image?: string | null;
  _count?: { products: number };
}

interface CategoriesClientProps {
  initialCategories: CategoryItem[];
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [search, setSearch] = useState("");

  // Стани модальних вікон
  const [activeModal, setActiveModal] = useState<"CREATE" | "EDIT" | "DELETE" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

  // Стани полів форми (спільні для створення та редагування)
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[ъыьэ]/g, "")
      .replace(/і/g, "i")
      .replace(/ї/g, "yi")
      .replace(/є/g, "ye")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setSlug(generatedSlug);
  };

  // Відкриття модалки створення
  const openCreateModal = () => {
    setName("");
    setSlug("");
    setParentId("");
    setErrorMsg("");
    setActiveModal("CREATE");
  };

  // Відкриття модалки редагування
  const openEditModal = (cat: CategoryItem) => {
    setSelectedCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setParentId(cat.parentId || "");
    setErrorMsg("");
    setActiveModal("EDIT");
  };

  // Відкриття модалки видалення
  const openDeleteModal = (cat: CategoryItem) => {
    setSelectedCategory(cat);
    setActiveModal("DELETE");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedCategory(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Сабміт створення категорії
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("parentId", parentId);
    if (fileInputRef.current?.files?.[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    const res = await createCategoryAction(formData);
    if (res.success) {
      window.location.reload(); // Перезавантажуємо сторінку для чистого SSR оновлення Blob картинок
    } else {
      setErrorMsg(res.error || "Помилка сервера");
      setIsSubmitting(false);
    }
  };

  // Сабміт редагування категорії
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !name.trim()) return;
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("parentId", parentId);
    if (fileInputRef.current?.files?.[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    const res = await updateCategoryAction(selectedCategory.id, formData);
    if (res.success) {
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Помилка сервера");
      setIsSubmitting(false);
    }
  };

  // Підтвердження видалення категорії
  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    setIsSubmitting(true);
    const res = await deleteCategoryAction(selectedCategory.id);
    if (res.success) {
      setCategories(prev => prev.filter(c => c.id !== selectedCategory.id && c.parentId !== selectedCategory.id));
      closeModal();
    } else {
      alert(res.error);
    }
    setIsSubmitting(false);
  };

  // Тільки кореневі категорії для вибору вкладеності (не даємо вибрати самого себе як батька при редагуванні)
  const rootCategories = categories.filter(c => !c.parentId && c.id !== selectedCategory?.id);

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* ВЕРХНІЙ ТУЛБАР: ПОШУК ТА СУПЕР КНОПКА ДОДАННЯ */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#111827]/20 p-4 border border-slate-800/60 rounded-2xl">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Пошук за назвою або слагом категорії..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 transition-colors font-medium"
          />
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)] cursor-pointer"
        >
          <FolderPlus className="w-4 h-4 stroke-[2.5]" />
          Додати нову категорію
        </button>
      </div>

      {/* СІТКА КАТЕГОРІЙ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredCategories.length === 0 ? (
            <div className="col-span-full p-16 bg-[#111827]/10 border border-slate-800/40 rounded-2xl text-center text-slate-500 text-xs italic">
              Жодного розділу каталогу за вашим запитом не знайдено.
            </div>
          ) : (
            filteredCategories.map((cat) => {
              const isSub = !!cat.parentId;
              return (
                <motion.div
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
                  className={`p-4 bg-[#111827]/40 border rounded-2xl flex items-center justify-between gap-3 group hover:border-slate-700/60 transition-all ${isSub ? "border-slate-800/40 ml-6 bg-[#111827]/10 shadow-inner" : "border-slate-800/80 shadow-md"
                    }`}
                >
                  <div className="space-y-1 overflow-hidden flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-slate-700 transition-colors">
                      {cat.base64Image ? (
                        <img src={cat.base64Image} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <Tag className="w-4 h-4 text-amber-400" />
                      )}
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1">
                        {isSub && <CornerDownRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                        <h3 className="font-extrabold text-white text-sm truncate leading-tight group-hover:text-amber-400 transition-colors">{cat.name}</h3>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">slug: {cat.slug}</p>
                      <span className="inline-block text-[9px] font-black bg-slate-900 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-md mt-1 font-mono">
                        Лотів: {cat._count?.products || 0}
                      </span>
                    </div>
                  </div>

                  {/* ПАНЕЛЬ УПРАВЛІННЯ КАРТКОЮ */}
                  <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2 border border-slate-800 bg-slate-950/40 text-slate-400 hover:text-amber-400 hover:border-amber-500/20 rounded-xl transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(cat)}
                      className="p-2 border border-slate-800 bg-slate-950/40 text-slate-500 hover:text-rose-400 hover:border-rose-500/20 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================================= */}
      {/* СУПЕР КРАСИВА МАТРИЦЯ ВИПЛИВАЮЧИХ ВІКОН (MODALS SYSTEM) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* ШИКАРНИЙ НЕОНОВИЙ ОВЕРЛЕЙ З РОЗМИВАННЯМ ФОНУ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-[#070a13]/80 backdrop-blur-md"
            />

            {/* КОНТЕНТНЕ ВІКНО МОДАЛКИ */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
              className="bg-[#0f172a] border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative overflow-hidden z-10 font-sans"
            >
              {/* Верхнє неонове свічення всередині вікна */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Заголовок модалки */}
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-3.5 mb-5 relative z-10">
                <div className="flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                    {activeModal === "CREATE" && "Створення категорії"}
                    {activeModal === "EDIT" && "Редагування розділу"}
                    {activeModal === "DELETE" && "Підтвердження видалення"}
                  </h2>
                </div>
                <button type="button" onClick={closeModal} className="p-1 text-slate-500 hover:text-white transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ФОРМИ СТВОРЕННЯ / РЕДАГУВАННЯ */}
              {(activeModal === "CREATE" || activeModal === "EDIT") && (
                <form onSubmit={activeModal === "CREATE" ? handleCreateSubmit : handleEditSubmit} className="space-y-4 relative z-10">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Назва категорії</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="напр. Комп'ютери та ноутбуки"
                      className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-400/60 transition-colors font-medium font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Системний URL Slug</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="computers-and-laptops"
                      className="w-full px-4 py-2.5 bg-slate-950/20 border border-slate-800 rounded-xl text-sm text-amber-400 font-mono focus:outline-none focus:border-amber-400/60 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Батьківська категорія</label>
                    <select
                      value={parentId}
                      onChange={(e) => setParentId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-amber-400/60 transition-colors cursor-pointer"
                    >
                      <option value="">Немає (Кореневий розділ)</option>
                      {rootCategories.map(c => (
                        <option key={c.id} value={c.id}>↳ {c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Зображення / Іконка (Blob)</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-800 file:text-amber-400 hover:file:bg-slate-700 file:cursor-pointer transition-colors"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errorMsg}
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-3">
                    <button type="button" onClick={closeModal} className="px-4 py-2.5 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer">
                      Скасувати
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? "Синхронізація..." : "Зберегти зміни"}
                    </button>
                  </div>
                </form>
              )}

              {/* ВІКНО КАТАСТРОФІЧНОГО ВИДАЛЕННЯ */}
              {activeModal === "DELETE" && selectedCategory && (
                <div className="space-y-5 relative z-10 text-center py-2">
                  <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto text-xl shadow-lg">
                    ⚠️
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-extrabold text-white text-base">Видалення розділу «{selectedCategory.name}»</h3>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                      Увага! Опція <strong className="text-rose-400 font-mono">Cascade Delete</strong> активна у Prisma. Стирання цієї категорії автоматично знищить усі підкатегорії та зв'язки з товарами вендорів без можливості відновлення!
                    </p>
                  </div>

                  <div className="pt-4 flex justify-center gap-3">
                    <button type="button" onClick={closeModal} className="px-4 py-2.5 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer">
                      Ні, назад
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteConfirm}
                      disabled={isSubmitting}
                      className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? "Видалення..." : "Так, стерти назавжди"}
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
  )
}
