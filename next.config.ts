import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["@prisma/client", "pg"],
  // ✨ КРИТИЧНО ДЛЯ NEXT.JS 16: Вимикаємо кешування динамічних сторінок на клієнті,
  // щоб токен миттєво підтягувався при редіректі на /dashboard
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 180,
    },
  },
};

export default nextConfig;

