import "dotenv/config";
import { defineConfig } from "prisma/config";

// Перевіряємо наявність реальної змінної, інакше беремо робочу заглушку для стадії білду на Vercel
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
});
