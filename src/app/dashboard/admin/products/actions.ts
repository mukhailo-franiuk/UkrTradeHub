"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

/**
 * Допоміжна функція переведення кирилиці в латиницю для генерації валідного slug
 */
function generateSlug(text: string): string {
  const ukrToLat: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
    'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
    'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya'
  };

  const cleaned = text
    .toLowerCase()
    .trim()
    .split('')
    .map(char => ukrToLat[char] !== undefined ? ukrToLat[char] : char)
    .join('');

  return cleaned
    .replace(/[^a-z0-9\s-]/g, '') 
    .replace(/\s+/g, '-')         
    .replace(/-+/g, '-')          
    .concat(`-${Date.now()}`);    
}

/**
 * Функція генерації унікального SKU для варіації
 */
function generateVariantSKU(brand: string, title: string, index: number): string {
  const cleanBrand = brand.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase() || "VEL";
  const cleanTitle = title.replace(/[^a-zA-Z0-9а-яА-ЯёЁіІїЇєЄ]/g, '').substring(0, 2).toUpperCase() || "PR";
  return `${cleanBrand}-${cleanTitle}-${Date.now()}-${index}`;
}

/**
 * Оновлення статусу модерації товару (APPROVED / REJECTED)
 */
export async function updateProductStatusAction(id: string, newStatus: "APPROVED" | "REJECTED") {
  try {
    await (prisma as any)['product'].update({
      where: { id },
      data: { status: newStatus }
    });

    revalidatePath("/dashboard/admin/products");
    return { success: true };
  } catch (error: any) {
    console.error("Помилка оновлення статусу товару:", error);
    return { success: false, error: error.message || "Не вдалося оновити статус" };
  }
}

/**
 * Остаточне видалення лоту з бази даних платформи
 */
export async function deleteProductAdminAction(id: string) {
  try {
    await (prisma as any)['productVariant'].deleteMany({ where: { productId: id } });
    await (prisma as any)['productImage'].deleteMany({ where: { productId: id } });
    
    await (prisma as any)['product'].delete({
      where: { id }
    });

    revalidatePath("/dashboard/admin/products");
    return { success: true };
  } catch (error: any) {
    console.error("Помилка видалення товару адміном:", error);
    return { success: false, error: error.message || "Не вдалося видалити лот" };
  }
}

/**
 * Пряме створення товару адміном
 */
export async function createProductAdminAction(formData: FormData, variantsData: any[]) {
  try {
    const title = formData.get("title") as string;
    const brand = formData.get("brand") as string;
    const categoryId = formData.get("categoryId") as string;
    const description = formData.get("description") as string;
    const imagesFiles = formData.getAll("images") as File[];

    if (!title || !brand || !categoryId) {
      return { success: false, error: "Будь ласка, заповніть обов'язкові поля: назва, бренд та категорія." };
    }

    // 1. АВТОМАТИЧНЕ ЗАБЕЗПЕЧЕННЯ СИСТЕМНОГО МАГАЗИНУ
    let adminShop = await (prisma as any)['shop'].findFirst({
      where: { name: "Vela Market" }
    });

    if (!adminShop) {
      const fallbackUser = await (prisma as any)['user'].findFirst({
        where: { role: "ADMIN" }
      }) || await (prisma as any)['user'].findFirst();

      if (!fallbackUser) {
        return { success: false, error: "У базі даних не знайдено жодного користувача для прив'язки магазину." };
      }

      adminShop = await (prisma as any)['shop'].create({
        data: {
          name: "Vela Market",
          slug: "vela-market",
          vendor: {
            connect: { id: fallbackUser.id }
          }
        }
      });
    }

    // 2. ЗАВАНТАЖЕННЯ ФОТОГРАФІЙ У VERCEL BLOB
    const uploadedImages: string[] = [];
    for (const file of imagesFiles) {
      if (file && file.size > 0) {
        const blob = await put(`products/${Date.now()}-${file.name}`, file, {
          access: "public",
        });
        uploadedImages.push(blob.url);
      }
    }

    // ГЕНЕРАЦІЯ УНІКАЛЬНОГО SLUG ДЛЯ ТОВАРУ
    const productSlug = generateSlug(title);

    // 3. ЗАПИС ЛОТУ ТА ВАРІАНТІВ У БАЗУ ДАННЫХ NEON
    const newProduct = await (prisma as any)['product'].create({
      data: {
        title,
        brand,
        slug: productSlug, // ВИПРАВЛЕНО: SKU видалено звідси, бо модель Product його не має
        description,
        categoryId,
        shopId: adminShop.id, 
        status: "APPROVED",  
        isHotDeal: false,
        isFeatured: false,
        
        images: {
          create: uploadedImages.map((url, index) => ({
            imageUrl: url,
            isMain: index === 0
          }))
        },

        variants: {
          create: variantsData.map((v, idx) => ({
            sku: generateVariantSKU(brand, title, idx), // ВИПРАВЛЕНО: SKU тепер створюється у кожній варіації ProductVariant
            price: Number(v.price) || 0,
            oldPrice: v.oldPrice ? Number(v.oldPrice) : null,
            stock: Number(v.stock) || 0,
            attributes: v.attributes || {}
          }))
        }
      }
    });

    revalidatePath("/dashboard/admin/products");
    return { success: true, product: newProduct };

  } catch (error: any) {
    console.error("Критична помилка виконання екшену адміна:", error);
    return { success: false, error: error.message || "Внутрішня помилка сервера при збереженні товару" };
  }
}
