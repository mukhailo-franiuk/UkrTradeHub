import { ImageResponse } from "next/og";

// Конфігурація розміру іконки для вкладки браузера
export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      // Контейнер іконки
      <div
        style={{
          fontSize: 24,
          background: "#0f172a", // Наш глибокий синій колір бренду bg-brand-primary
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "25%", // Стильне скруглення (іконка у стилі iOS)
          position: "relative",
          padding: "4px",
        }}
      >
        {/* Векторний знак геометрії літачка/вітрини з нашого Logo */}
        <svg
          viewBox="0 0 100 100"
          style={{
            width: "85%",
            height: "85%",
          }}
          fill="none"
          xmlns="http://w3.org"
        >
          {/* Ліве крило знаку (Золотий акцент text-brand-accent) */}
          <path
            d="M15 25L50 85L50 45L15 25Z"
            fill="#fbbf24"
          />
          {/* Праве крило знаку (Тіньовий темніший золотий) */}
          <path
            d="M85 25L50 85L50 45L85 25Z"
            fill="#f59e0b"
          />
          {/* Верхня сигнальна крапка розпродажу */}
          <circle cx="50" cy="20" r="7" fill="#f43f5e" />
        </svg>
      </div>
    ),
    // Розширення для генерації
    {
      ...size,
    }
  );
}
