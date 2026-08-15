"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface OrderItemInput {
  id: string;          // ProductVariant ID
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

interface CustomerInput {
  name: string;
  phone: string;
  city: string;
  department: string;
  paymentMethod: "CARD" | "CASH_ON_DELIVERY" | "BONUS_BALANCE"; // Збігається з Prisma ENUM
}

export async function checkoutOrderAction(customer: CustomerInput, goods: OrderItemInput[]) {
  try {
    if (!goods || goods.length === 0) {
      return { success: false, error: "Кошик порожній. Немає товарів для оформлення." };
    }

    // 1. АВТЕНТИФІКАЦІЯ / ПОШУК КОРИСТУВАЧА (userId є обов'язковим для моделі Order)
    // Тимчасовий фолбек: беремо першого користувача (наприклад, покупця чи адміна), поки немає сесії Auth
    const fallbackUser = await (prisma as any).user.findFirst();
    if (!fallbackUser) {
      return { success: false, error: "У базі даних не знайдено жодного користувача для оформлення замовлення." };
    }

    // 2. ЗАПУСК КРИТИЧНОЇ ТРАНЗАКЦІЇ
    const result = await (prisma as any).$transaction(async (tx: any) => {
      const itemsToCreate = [];

      for (const item of goods) {
        // Запитуємо варіант разом із зв'язаним продуктом, щоб дізнатися shopId магазину
        const variant = await tx.productVariant.findUnique({
          where: { id: item.id },
          select: { 
            stock: true, 
            product: { 
              select: { 
                title: true,
                shopId: true // Обов'язково для OrderItem
              } 
            } 
          }
        });

        if (!variant) {
          throw new Error(`Товар "${item.title}" більше не існує на платформі.`);
        }

        if (variant.product.shopId === undefined || !variant.product.shopId) {
          throw new Error(`Товар "${item.title}" не прив'язаний до жодного діючого магазину.`);
        }

        if (variant.stock < item.quantity) {
          throw new Error(`Недостатньо одиниць "${item.title}" на складі. Доступно для замовлення: ${variant.stock} шт.`);
        }

        // Зменшуємо залишок на складі (Списання зі stock)
        await tx.productVariant.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });

        // Формуємо масив для створення OrderItem
        itemsToCreate.push({
          shopId: variant.product.shopId, // Передаємо витягнутий shopId продавця
          productVariantId: item.id,
          quantity: item.quantity,
          price: item.price, // Prisma автоматично приведе number до Decimal
        });
      }

      // Обчислюємо фінальну суму замовлення
      const totalAmount = goods.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      // Конкатенуємо адресу доставки для текстового поля shippingAddress
      const fullShippingAddress = `ПІБ: ${customer.name}, Тел: ${customer.phone}, Місто: ${customer.city}, Відділення: ${customer.department}`;

      // 3. СТВОРЕННЯ ЗАПИСУ ЗАМОВЛЕННЯ ЗГІДНО З ВАШОЮ СХЕМОЮ
      const newOrder = await tx.order.create({
        data: {
          userId: fallbackUser.id,              // Спадкова прив'язка до User
          status: "PENDING",                    // Наш ENUM OrderStatus
          paymentMethod: customer.paymentMethod,// Наш ENUM PaymentMethod
          isPaid: false,
          totalAmount: totalAmount,             // Сума замовлення Decimal
          discountAmount: 0.00,
          cashbackEarned: totalAmount * 0.02,   // Наприклад, нараховуємо 2% кешбеку в полі для аналітики
          shippingAddress: fullShippingAddress, // Об'єднаний рядок адреси
          
          items: {
            create: itemsToCreate
          }
        }
      });

      return newOrder;
    });

    // Очищаємо кеш роутів для відображення оновлених складів
    revalidatePath("/dashboard/admin/products");
    revalidatePath("/products");

    return { success: true, orderId: result.id };

  } catch (error: any) {
    console.error("Критична помилка транзакції замовлення:", error);
    return { success: false, error: error.message || "Внутрішня помилка сервера при збереженні замовлення в Neon" };
  }
}
