import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

// 1. Ініціалізуємо пул ОДИН РАЗ і ховаємо у глобальний контекст
if (!globalForPrisma.pgPool) {
  globalForPrisma.pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: true, // Режим verify-full проти SSL ворнінгів
    },
    max: 10, // Обмежуємо кількість одночасних конекшнів до Neon
    idleTimeoutMillis: 30000, // Автоматично закриваємо неактивні з'єднання
    connectionTimeoutMillis: 5000, // Таймаут на підключення, щоб сервер не зависав на 19 секунд
  });
}

const pool = globalForPrisma.pgPool;
const adapter = new PrismaPg(pool);

// 2. Створюємо єдиний екземпляр Prisma Client
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter,
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
