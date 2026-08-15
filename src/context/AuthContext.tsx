"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "BUYER" | "VENDOR" | "ADMIN";
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Функція для запиту поточного юзера з API
  const refreshUser = async () => {
    try {
      // Виправляємо: змушуємо fetch примусово передавати кукі та ігнорувати кеш Next.js
      const res = await fetch("/api/auth/me", {
        credentials: "include", // Обов'язково для передачі кукі в Next.js App Router
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache"
        }
      });
      
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Помилка контексту при перевірці сесії:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Перевіряємо сесію один раз при першому завантаженні сайту
  useEffect(() => {
    refreshUser();
  }, []);

  // Викликається на сторінці входу після успішного fetch-запиту
  const login = (userData: User) => {
    setUser(userData);
  };

  // Викликається при натисканні "Вийти"
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Помилка при логауті:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth має використовуватися всередині AuthProvider");
  }
  return context;
}
