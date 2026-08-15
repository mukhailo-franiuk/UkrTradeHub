// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { compareSync } from "bcrypt-ts";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Валідація наявності обов'язкових полів
    if (!email || !password) {
      return NextResponse.json(
        { message: "Будь ласка, введіть електронну пошту та пароль." },
        { status: 400 } // Тепер це реальний HTTP-статус
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 2. Пошук користувача в базі даних
    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    // 3. Якщо користувача з таким Email не існує
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { message: "Невірна адреса електронної пошти або пароль." },
        { status: 401 }
      );
    }

    // 4. Перевірка відповідності хешу пароля через bcrypt-ts
    const isPasswordValid = compareSync(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Невірна адреса електронної пошти або пароль." },
        { status: 401 }
      );
    }

    // 5. Генерація захищеного JWT-токена через бібліотеку 'jose'
    const SECRET_KEY = new TextEncoder().encode(
      process.env.JWT_SECRET || "KHGSaykauyws672153712y8ehdslsahdawilutgkGHKJADKJGJH"
    );

    const token = await new SignJWT({ id: user.id, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") // Токен буде дійсним 7 днів
      .sign(SECRET_KEY);

    // 6. Формування успішної відповіді через NextResponse
    const response = NextResponse.json(
      {
        message: "Вхід успішно виконано!",
        role: user.role
      },
      { status: 200 }
    );

    // 7. Запис кукі через стандартний метод Next.js
    // ✨ ВИПРАВЛЕНО: Для Next.js 15/16 прапорці розробки мають передаватися строго без конфліктів заголовків
    response.cookies.set("velamarket_auth_token", token, {
      httpOnly: true, // Повний захист від XSS
      secure: process.env.NODE_ENV === "production", // Автоматично false на localhost і true на продакшені
      sameSite: "lax", 
      maxAge: 60 * 60 * 24 * 7, // 7 днів
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Login backend error:", error);
    return NextResponse.json(
      { message: "Сталася внутрішня помилка сервера. Спробуйте пізніше." },
      { status: 500 }
    );
  }
}
