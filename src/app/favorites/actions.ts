"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Отримати всі обрані товари користувача за його ID
export async function getWishlistItems(userId: string) {
  if (!userId) return { success: false, error: "Не вказано ID користувача" };

  try {
    const favorites = await (prisma as any).wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { select: { imageUrl: true }, take: 1 }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return { success: true, favorites };
  } catch (error: any) {
    console.error("Помилка завантаження обраного з Neon:", error);
    return { success: false, error: "Помилка сервера" };
  }
}

// 2. Перемикач стану (Додати / Видалити) — приймає userId з клієнта
export async function toggleWishlistItem(productId: string, userId: string) {
  if (!userId) return { success: false, error: "Будь ласка, увійдіть в акаунт на UkrTradeHub" };

  try {
    // Перевіряємо наявність запису за унікальним індексом @@unique([userId, productId])
    const existing = await (prisma as any).wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (existing) {
      await (prisma as any).wishlistItem.delete({
        where: { id: existing.id }
      });
      return { success: true, action: "removed" };
    } else {
      await (prisma as any).wishlistItem.create({
        data: {
          userId,
          productId
        }
      });
      return { success: true, action: "added" };
    }
  } catch (error: any) {
    console.error("Помилка бази Neon:", error);
    return { success: false, error: "Не вдалося змінити статус" };
  }
}

// 3. Швидке видалення картки
export async function removeFromWishlist(productId: string, userId: string) {
  if (!userId) return { success: false };

  try {
    await (prisma as any).wishlistItem.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
