import { NextResponse } from "next/server";
import { hashSync } from "bcrypt-ts";
import { prisma } from "@/lib/prisma"; // Імпортуємо наш залізобетонний синглтон

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Валідація даних
    if (!name || !name.trim() || !email || !password) {
      return NextResponse.json(
        { message: "Усі поля є обов'язковими для заповнення." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { message: "Будь ласка, введіть коректну адресу електронної пошти." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Пароль має бути не менше 8 символів." },
        { status: 400 }
      );
    }

    // Проверка на уникальность Email
    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Користувач з такою електронною поштою вже зареєстрований." },
        { status: 409 }
      );
    }

    const hashedPassword = hashSync(password, 10);

    // Выполнение ACID транзакции
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: name.trim(),
          email: trimmedEmail,
          passwordHash: hashedPassword,
          role: "BUYER",
          balanceUah: 150.00,
          provider: "credentials",
        },
      });

      // Зберігаємо твоє розумне виправлення крашу для моделі Transaction
      await (tx as any)['transaction'].create({
        data: {
          userId: newUser.id,
          amount: 150.00,
          type: "CASHBACK",
          description: "Вітальний бонус 150 грн за реєстрацію на маркетплейсі VelaMarket",
        },
      });

      return newUser;
    });

    return NextResponse.json(
      {
        message: "Акаунт успешно створено!",
        user: {
          id: result.id,
          name: result.name,
          email: result.email,
          role: result.role,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Advanced registration backend error:", error);
    return NextResponse.json(
      { message: "Сталася внутрішня помилка сервера. Спробуйте пізніше." },
      { status: 500 }
    );
  }
}
