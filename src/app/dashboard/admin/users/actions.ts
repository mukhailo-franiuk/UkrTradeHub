'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserRoleAction(userId: string, newRole: "ADMIN" | "VENDOR" | "BUYER") {
  try {
    if (!userId || !["ADMIN", "VENDOR", "BUYER"].includes(newRole)) {
      return { success: false, error: "Некоректні дані" };
    }

    // КРИТИЧНИЙ ЗАХИСТ: Перевіряємо поточну роль користувача в базі Neon перед оновленням
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (currentUser?.role === "ADMIN") {
      return { success: false, error: "Заборонено: не можна змінювати або знижувати права Адміністратора!" };
    }

    // Якщо користувач не адмін — безпечно оновлюємо роль
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Критична помилка оновлення ролі:", error);
    return { success: false, error: "Внутрішня помилка сервера" };
  }
}
