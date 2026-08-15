'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob"; // Імпортуємо методи завантаження та видалення з Vercel Blob

// Функція створення нової категорії
export async function createCategoryAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const parentId = formData.get("parentId") as string || null;
    const imageFile = formData.get("image") as File | null;

    if (!name || !slug) {
      return { success: false, error: "Назва та Slug є обов'язковими" };
    }

    // 1. Завантажуємо зображення у Vercel Blob сховище, якщо воно прикріплене
    let uploadedImageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      const blob = await put(`categories/${slug}-${Date.now()}.${imageFile.name.split('.').pop()}`, imageFile, {
        access: 'public', // Робимо файл публічно доступним за посиланням
      });
      uploadedImageUrl = blob.url; // Отримуємо чистий CDN URL (напр. https://vercel-storage.com...)
    }

    // 2. Записуємо категорію в базу Neon з легким URL посиланням
    await (prisma as any)['category'].create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        parentId: parentId || null,
        imageUrl: uploadedImageUrl, // Текстове посилання замість важких байтів
      }
    });

    revalidatePath("/dashboard/admin/categories");
    return { success: true };
  } catch (error: any) {
    console.error("Помилка створення категорії з Vercel Blob:", error.message);
    return { success: false, error: "Не вдалося створити категорію у системі" };
  }
}

// Функція редагування/оновлення наявної категорії
export async function updateCategoryAction(id: string, formData: FormData) {
  try {
    if (!id) return { success: false, error: "ID категорії відсутній" };

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const parentId = formData.get("parentId") as string || null;
    const imageFile = formData.get("image") as File | null;

    if (!name || !slug) {
      return { success: false, error: "Назва та Slug є обов'язковими" };
    }

    // Зчитуємо поточну категорію, щоб дізнатися, чи є стара картинка, яку треба замінити
    const currentCategory = await (prisma as any)['category'].findUnique({ where: { id } });

    const updateData: any = {
      name,
      slug: slug.toLowerCase().replace(/\s+/g, "-"),
      parentId: parentId || null,
    };

    // Якщо завантажено нове зображення
    if (imageFile && imageFile.size > 0) {
      // Спочатку видаляємо стару картинку з Vercel Blob, щоб не накопичувати сміття
      if (currentCategory?.imageUrl) {
        try {
          await del(currentCategory.imageUrl);
        } catch (e) {
          console.error("Стару картинку не знайдено у сховищі для видалення");
        }
      }

      // Завантажуємо нову картинку
      const blob = await put(`categories/${slug}-${Date.now()}.${imageFile.name.split('.').pop()}`, imageFile, {
        access: 'public',
      });
      updateData.imageUrl = blob.url;
    }

    await (prisma as any)['category'].update({
      where: { id },
      data: updateData
    });

    revalidatePath("/dashboard/admin/categories");
    return { success: true };
  } catch (error: any) {
    console.error("Помилка редагування категорії з Vercel Blob:", error.message);
    return { success: false, error: "Не вдалося оновити категорію" };
  }
}

// Функція видалення категорії
export async function deleteCategoryAction(id: string) {
  try {
    if (!id) return { success: false, error: "Некоректний ID" };

    // Зчитуємо категорію перед видаленням, щоб стерти її файл з хмари
    const category = await (prisma as any)['category'].findUnique({ where: { id } });
    if (category?.imageUrl) {
      try {
        await del(category.imageUrl);
      } catch (e) {
        console.error("Помилка видалення файлу з Vercel Blob");
      }
    }

    await (prisma as any)['category'].delete({
      where: { id }
    });

    revalidatePath("/dashboard/admin/categories");
    return { success: true };
  } catch (error: any) {
    console.error("Помилка видалення категорії:", error.message);
    return { success: false, error: "Не вдалося видалити категорію" };
  }
}
