import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Зчитуємо JSON-тіло запиту, яке нам надсилає Monobank
    const body = await request.json();
    console.log("=== [MONOBANK WEBHOOK RECEIVED] ===", body);

    // Перевіряємо базову валідність структури запиту від Monobank
    if (!body || !body.invoiceId || !body.status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { merchantInternalOrderId, status, invoiceId } = body;

    // 2. РЕАГУЄМО ТІЛЬКИ НА УСПІШНУ ОПЛАТУ ("success")
    if (status === "success") {
      console.log(`Фонд замовлення ${merchantInternalOrderId} успішно списано через інвойс ${invoiceId}`);

      // Запускаємо транзакційне оновлення статусу замовлення в базі Neon
      await (prisma as any).$transaction(async (tx: any) => {
        // Шукаємо замовлення за ID, яке ми раніше зафіксували у полі merchantInternalOrderId
        const order = await tx.order.findUnique({
          where: { id: merchantInternalOrderId },
        });

        if (!order) {
          console.error(`[WEBHOOK ERROR] Замовлення ${merchantInternalOrderId} не знайдено в базі даних.`);
          return;
        }

        // Оновлюємо статус замовлення згідно з нашими ENUM у schema.prisma
        await tx.order.update({
          where: { id: merchantInternalOrderId },
          data: {
            status: "PAID",   // Переводимо в статус PAID (Оплачено)
            isPaid: true,     // Фіксуємо факт успішної оплати
          },
        });

        console.log(`[DATABASE UPDATED] Замовлення ${merchantInternalOrderId} переведено в статус PAID.`);
      });
    } else {
      // Якщо статус платежу інший (наприклад, "failure", "reversed", "expired")
      console.log(`Платіж по замовленню ${merchantInternalOrderId} має статус: ${status}. Базу не оновлюємо.`);
    }

    // 3. ОБОВ'ЯЗКОВА ВІДПОВІДЬ ДЛЯ MONOBANK
    // Платіжний шлюз Monobank вимагає, щоб вебхук завжди повертав чистий статус HTTP 200.
    // Якщо цього не зробити, Монобанк буде слати цей запит повторно кожні кілька хвилин.
    return new NextResponse("OK", { status: 200 });

  } catch (error: any) {
    console.error("❌ Критична помилка обробки вебхуку Monobank:", error);
    // Навіть у разі внутрішньої помилки повертаємо 200 або 500 залежно від логіки моніторингу
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
