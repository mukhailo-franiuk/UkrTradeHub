// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "KHGSaykauyws672153712y8ehdslsahdawilutgkGHKJADKJGJH"
);

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Отримуємо токен авторизації з кукі браузера
  const tokenCookie = req.cookies.get("velamarket_auth_token");
  const token = tokenCookie?.value;

  // Якщо користувач не авторизований, відправляємо на /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Верифікація токена
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const userRole = payload.role as string; // "ADMIN" | "VENDOR" | "BUYER"

    // ✨ НОВА КРИТИЧНА ЛОГІКА: Якщо юзер заходить просто на базовий URL "/dashboard",
    // проксі автоматично перенаправляє його у правильну підпапку, оминаючи видалений page.tsx
    if (path === "/dashboard" || path === "/dashboard/") {
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      } else if (userRole === "VENDOR") {
        return NextResponse.redirect(new URL("/dashboard/vendor", req.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard/buyer", req.url));
      }
    }

    // Захист панелі адміністратора
    if (path.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/buyer", req.url));
    }

    // Захист панелі продавця
    if (path.startsWith("/dashboard/vendor") && userRole !== "VENDOR" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/buyer", req.url));
    }

    return NextResponse.next();

  } catch (error: any) {
    console.error("🚨 PROXY JWT ERROR:", error?.message || error);

    // Створюємо редірект на логін якщо токен зламаний
    const response = NextResponse.redirect(new URL("/login", req.url));
    
    // Примусово затираємо кукі
    response.headers.set(
      "Set-Cookie",
      "velamarket_auth_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0"
    );
    
    return response;
  }
}

export const config = {
  // Конфігуруємо так, щоб проксі відловлював і сам базовий /dashboard, і всі підроути
  matcher: ["/dashboard", "/dashboard/:path*"],
};
