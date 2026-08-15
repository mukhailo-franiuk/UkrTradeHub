'use server'

import { prisma } from "@/lib/prisma"; // ВИПРАВЛЕНО: тепер використовуємо єдиний глобальний пул
import { revalidatePath } from "next/cache";
import { ProductStatus } from "@prisma/client";

export async function updateProductStatus(productId: string, status: ProductStatus) {
  try {
    if (!productId || !Object.values(ProductStatus).includes(status)) {
      return; // Нічого не повертаємо (void)
    }

    // Оновлюємо статус товару через стабільне з'єднання
    await prisma.product.update({
      where: { id: productId },
      data: { status },
    });

    // Миттєво скидаємо кеш адмінки та кабінету продавця для рендерингу нових даних
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/vendor");
  } catch (error) {
    console.error("Критична помилка Server Action:", error);
    // Нічого не повертаємо (void)
  }
}
