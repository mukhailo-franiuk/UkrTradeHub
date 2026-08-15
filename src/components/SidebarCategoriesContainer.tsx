import React from "react";
import { prisma } from "@/lib/prisma";
import SidebarCategories from "./sections/SidebarCategories"; // 👈 Імпорт клієнтської частини з підпапки

export const revalidate = 300;

async function getRootCategories() {
  try {
    return await (prisma as any)['category'].findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Помилка завантаження категорій для сайдбару:", error);
    return [];
  }
}

export default async function SidebarCategoriesContainer() {
  const dbCategories = await getRootCategories();

  const formattedCategories = dbCategories.map((cat: any) => ({
    name: cat.name,
    href: `/catalog/${cat.slug}`,
    imageUrl: cat.imageUrl || null,
  }));

  // Передаємо пропс serverCategories — тепер помилка зникне!
  return <SidebarCategories serverCategories={formattedCategories} />;
}
