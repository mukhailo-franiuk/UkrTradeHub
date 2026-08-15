'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateShopStatusAction(shopId: string, makeActive: boolean) {
  try {
    if (!shopId) {
      return { success: false, error: "Некоректний ID магазину" };
    }

    // Якщо адмін натискає "Заблокувати" — ставимо SUSPENDED.
    // Якщо натискає "Активувати" — прибираємо з очікування. Оскільки ми не знаємо назву третього статусу (можливо APPROVED),
    // ми ставимо "APPROVED" через as any, або якщо у тебе двокомпонентний статус, вкажи потрібне значення.
    const newStatus = makeActive ? "APPROVED" : "SUSPENDED";

    await prisma.shop.update({
      where: { id: shopId },
      data: { status: newStatus as any }
    });

    revalidatePath("/dashboard/admin/shops");
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Критична помилка зміни статусу магазину:", error);
    return { success: false, error: "Внутрішня помилка сервера" };
  }
}

