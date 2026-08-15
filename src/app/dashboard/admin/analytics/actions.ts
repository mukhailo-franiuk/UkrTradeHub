'use server'

import { prisma } from "@/lib/prisma";

export async function exportFinancialReportAction() {
  try {
    /**
     * ВИПРАВЛЕНО КРАШ ТИПІЗАЦІЇ:
     * Оскільки назва моделі у схемі — Transaction, а слово `transaction` перевантажене 
     * системними методами Prisma Client, ми отримуємо доступ до таблиці напряму 
     * через безпечний строковий ключ контексту (prisma as any)['transaction'].
     */
    const transactions = await (prisma as any)['transaction'].findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    // Формуємо CSV заголовки та рядки
    const csvHeaders = "ID Трансакції,Користувач,Email,Сума (₴),Тип,Опис,Дата\n";
    const csvRows = transactions.map((t: any) => {
      const userName = t.user?.name || "Покупець";
      const userEmail = t.user?.email || "N/A";
      const description = t.description ? t.description.replace(/,/g, " ") : "";
      return `"${t.id}","${userName}","${userEmail}",${Number(t.amount)},"${t.type}","${description}","${t.createdAt instanceof Date ? t.createdAt.toISOString() : new Date(t.createdAt).toISOString()}"`;
    }).join("\n");

    const fullCsv = csvHeaders + csvRows;
    
    return { 
      success: true, 
      data: fullCsv, 
      filename: `velamarket_financial_report_${new Date().toISOString().split('T')[0]}.csv` 
    };
  } catch (error: any) {
    console.error("Помилка генерації фінансового звіту:", error.message);
    return { success: false, error: "Не вдалося згенерувати фінансовий звіт" };
  }
}
