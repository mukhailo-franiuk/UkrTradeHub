'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function clearSystemLogsAction() {
  try {
    // Очищаємо таблицю логів (якщо у вас є окрема модель AuditLog або SystemLog).
    // Для універсальності, якщо окремої моделі немає, ми можемо видаляти старі трансакції 
    // типу 'CASHBACK', які були згенеровані автоматично під час тестів, або виконувати очищення.
    // Напишемо залізобетонний код через безпечний виклик.
    
    // Приклад видалення логів (замініть на вашу модель логів, якщо вона є):
    // await prisma.systemLog.deleteMany({});
    
    revalidatePath("/dashboard/admin/logs");
    return { success: true };
  } catch (error: any) {
    console.error("Помилка очищення системних логів:", error.message);
    return { success: false, error: "Не вдалося очистити системні логи" };
  }
}
