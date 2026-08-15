'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Функція збереження або оновлення глобальних налаштувань маркетплейсу
export async function updateSystemSettingsAction(formData: FormData) {
  try {
    const platformFee = parseFloat(formData.get("platformFee") as string) || 5.0;
    const welcomeBonus = parseFloat(formData.get("welcomeBonus") as string) || 0.0;
    const maintenanceMode = formData.get("maintenanceMode") === "true";

    // Оновлюємо єдиний рядок у базі через універсальний безпечний виклик
    await (prisma as any)['systemSettings'].upsert({
      where: { id: "system_core_config" },
      update: {
        platformFee,
        welcomeBonus,
        maintenanceMode,
      },
      create: {
        id: "system_core_config",
        platformFee,
        welcomeBonus,
        maintenanceMode,
      },
    });

    revalidatePath("/dashboard/admin/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Помилка збереження налаштувань у базі Neon:", error.message);
    return { success: false, error: "Не вдалося зберегти конфігурацію ядра" };
  }
}
