import React from "react";
import { Metadata } from "next";
import CartPageClient from "./CartPageClient";

export const metadata: Metadata = {
  title: "Кошик та оформлення замовлення | ",
  description: "Перевірте товари у вашому кошику та заповніть дані для швидкої доставки по Україні.",
};

export default function CartPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] pt-8 pb-24 text-gray-900 dark:text-slate-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-8 text-gray-950 dark:text-white uppercase font-mono">
          Оформлення замовлення
        </h1>
        
        <CartPageClient />
      </div>
    </main>
  );
}
