"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { createProductAdminAction } from "./actions";
import { X, ShoppingBag, Layers, Trash2, Image as ImageIcon, AlertCircle } from "lucide-react";

interface CategoryItem {
    id: string;
    name: string;
}

interface AdminCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: CategoryItem[];
}

export default function AdminCreateModal({ isOpen, onClose, categories }: AdminCreateModalProps) {
    const [title, setTitle] = useState("");
    const [brand, setBrand] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [variants, setVariants] = useState<any[]>([{ price: "", oldPrice: "", stock: "10", color: "", spec: "" }]);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const addVariant = () => setVariants([...variants, { price: "", oldPrice: "", stock: "10", color: "", spec: "" }]);
    const removeVariant = (index: number) => variants.length > 1 && setVariants(variants.filter((_, i) => i !== index));
    const handleVariantChange = (index: number, field: string, value: string) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setImages(prev => [...prev, ...filesArray]);
            setPreviews(prev => [...prev, ...filesArray.map(f => URL.createObjectURL(f))]);
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg("");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("brand", brand);
        formData.append("categoryId", categoryId);
        formData.append("description", description);
        images.forEach(img => formData.append("images", img));

        const formattedVariants = variants.map(v => ({
            price: v.price,
            oldPrice: v.oldPrice || null,
            stock: v.stock,
            attributes: { ...(v.color && { color: v.color }), ...(v.spec && { specification: v.spec }) }
        }));

        const res = await createProductAdminAction(formData, formattedVariants);
        if (res.success) {
            window.location.reload();
        } else {
            setErrorMsg(res.error || "Помилка створення лоту");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isSubmitting && onClose()} className="fixed inset-0 bg-[#070a13]/80 backdrop-blur-md" />

            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 15 }}
                className="bg-[#0f172a] border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative z-10 my-8 max-h-[85vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-3 mb-5">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-amber-400" />
                        <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono">Пряме додавання лоту</h2>
                    </div>
                    <button type="button" onClick={onClose} disabled={isSubmitting} className="p-1 text-slate-500 hover:text-white transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
                </div>

                <form onSubmit={handleCreateSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Назва лоту</label>
                        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="напр. Смартфон Apple iPhone 15 Pro Max 256GB" className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400/60" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Бренд</label>
                            <input type="text" required value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="напр. Apple" className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400/60" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Розділ каталогу</label>
                            <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-400/60 cursor-pointer">
                                <option value="">Оберіть категорію...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Опис товару</label>
                        <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Опишіть лот, комплектацію та умови офіційної гарантії..." className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400/60 resize-none" />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-800/40 pb-1.5">
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Склади та ціноутворення</span>
                            <button type="button" onClick={addVariant} className="text-[9px] font-black uppercase text-amber-400 bg-amber-500/5 px-2.5 py-1 rounded border border-amber-500/10 hover:bg-amber-400 hover:text-slate-950 cursor-pointer transition-all">Додати варіацію</button>
                        </div>

                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                            {variants.map((v, idx) => (
                                <div key={idx} className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl grid grid-cols-5 gap-2 relative">
                                    <input type="number" required placeholder="Ціна" value={v.price} onChange={(e) => handleVariantChange(idx, "price", e.target.value)} className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-amber-400 font-mono w-full focus:outline-none" />
                                    <input type="number" placeholder="Стара" value={v.oldPrice} onChange={(e) => handleVariantChange(idx, "oldPrice", e.target.value)} className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-500 font-mono w-full focus:outline-none" />
                                    <input type="number" placeholder="Шт" value={v.stock} onChange={(e) => handleVariantChange(idx, "stock", e.target.value)} className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 font-mono w-full focus:outline-none" />
                                    <input type="text" placeholder="Колір" value={v.color} onChange={(e) => handleVariantChange(idx, "color", e.target.value)} className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 w-full focus:outline-none" />
                                    <div className="flex gap-1 items-center">
                                        <input type="text" placeholder="Спец" value={v.spec} onChange={(e) => handleVariantChange(idx, "spec", e.target.value)} className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none" />
                                        <button type="button" disabled={variants.length === 1} onClick={() => removeVariant(idx)} className="p-1 text-slate-600 hover:text-rose-400 disabled:opacity-20 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Галерея фото (Vercel Blob)</label>
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-[10px] font-bold text-slate-300 uppercase flex items-center gap-1.5 cursor-pointer transition-colors"><ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Вибрати файли</button>
                            <input type="file" multiple ref={fileInputRef} accept="image/*" onChange={handleImageChange} className="hidden" />
                            <span className="text-[10px] text-slate-500 font-mono">Обрано медіа-файлів: <strong className="text-slate-300">{images.length}</strong></span>
                        </div>

                        {previews.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto py-1.5">
                                {previews.map((url, i) => (
                                    <div key={i} className="w-10 h-10 rounded-lg border border-slate-800 shrink-0 relative overflow-hidden bg-slate-950">
                                        <img src={url} className="w-full h-full object-cover" alt="Прев'ю" />
                                        {i === 0 && (
                                            <span className="absolute bottom-0 inset-x-0 bg-amber-400 text-slate-950 font-mono font-black text-[7px] text-center uppercase py-0.5">
                                                Main
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ПОВІДОМЛЕННЯ ПРО ПОМИЛКИ */}
                    {errorMsg && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-1.5 font-medium animate-pulse">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errorMsg}
                        </div>
                    )}

                    {/* ФУТЕР МОДАЛКИ СТВОРЕННЯ */}
                    <div className="pt-2 border-t border-slate-800/60 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => onClose()}
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer"
                        >
                            Скасувати
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md"
                        >
                            {isSubmitting ? "Створення..." : "Зберегти товар"}
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
    )
}
