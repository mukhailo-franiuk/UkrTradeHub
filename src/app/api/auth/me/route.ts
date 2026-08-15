import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";

import { jwtVerify } from "jose";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const headersList = await headers();
    
    // 1. Спосіб: Стандартне зчитування за назвою
    let token = cookieStore.get("velamarket_auth_token")?.value;

    // 2. Спосіб (Залізобетонний): Якщо стандартний .get() збоїть, шукаємо перебором усього масиву кук
    if (!token) {
      const allCookies = cookieStore.getAll();
      const targetCookie = allCookies.find(c => c.name === "velamarket_auth_token");
      if (targetCookie) {
        token = targetCookie.value;
      }
    }

    // 3. Спосіб: Спроба дістати куку безпосередньо з сирого заголовка запиту
    if (!token) {
      const rawCookieHeader = headersList.get("cookie");
      if (rawCookieHeader) {
        const match = rawCookieHeader.match(/velamarket_auth_token=([^;]+)/);
        if (match) {
          token = match[1];
        }
      }
    }

    console.log("=========================================");
    console.log("🔍 ПОВТОРНА ДІАГНОСТИКА АВТОРИЗАЦІЇ");
    console.log("Фінальний знайдений токен через матрицю пошуку:", token ? "ЗНАЙДЕНО ГЛОБАЛЬНО ✅" : "ВІДСУТНІЙ ❌");

    if (!token) {
      return NextResponse.json({ error: "Токен відсутній" }, { status: 401 });
    }

    const secretString = process.env.JWT_SECRET;
    if (!secretString) {
      console.log("❌ Відмова 500: Відсутній JWT_SECRET у файлі .env");
      return NextResponse.json({ error: "Відсутній JWT_SECRET в .env" }, { status: 500 });
    }

    const secret = new TextEncoder().encode(secretString);
    let payload: any = null;

    try {
      const { payload: verifiedPayload } = await jwtVerify(token, secret);
      payload = verifiedPayload;
    } catch (err: any) {
      console.log("❌ Відмова 401: Помилка валідації підпису токена.");
      console.log("Причина помилки розшифровки:", err.message);
      return NextResponse.json({ error: "Невалідний токен" }, { status: 401 });
    }

    const userId = payload?.userId || payload?.id || payload?.sub;

    if (!userId) {
      return NextResponse.json({ error: "Некоректний ID користувача" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      console.log(`❌ Відмова 404: Користувач з ID ${userId} не знайдений в Neon.`);
      return NextResponse.json({ error: "Користувача не знайдено" }, { status: 404 });
    }

    console.log(`🎉 Успіх 200: Токен успішно пробився, користувач ${user.email} авторизований!`);
    console.log("=========================================");

    return NextResponse.json(user);

  } catch (error: any) {
    return NextResponse.json({ error: "Внутрішня помилка сервера" }, { status: 500 });
  }
}
