import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Повністю видаляємо вашу реальну куку авторизації 'velamarket_auth_token'
    cookieStore.set("velamarket_auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Ставимо час у минуле, щоб браузер миттєво стер файл
      path: "/", // Обов'язково вказуємо корінь, щоб очистити її глобально
    });

    // Для надійності зачищаємо також стандартні назви
    cookieStore.set("token", "", { httpOnly: true, expires: new Date(0), path: "/" });

    return NextResponse.json({ success: true, message: "Сесію успішно завершено" });
  } catch (error) {
    console.error("Помилка при виході з системи:", error);
    return NextResponse.json({ success: false, error: "Помилка сервера" }, { status: 500 });
  }
}
