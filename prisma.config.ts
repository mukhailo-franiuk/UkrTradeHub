import "dotenv/config";
import { defineConfig } from "prisma/config";

// Якщо Vercel приховує змінні під час генерації CLI, підставляємо безпечну заглушку для успішного білду
const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: dbUrl,
  },
});

