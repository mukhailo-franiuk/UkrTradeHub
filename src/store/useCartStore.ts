import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;          // Унікальний ID конкретної варіації (Variant ID)
  productId: string;   // ID самого продукту
  title: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  attributes: Record<string, any>;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Додавання товару або збільшення кількості, якщо він вже є
      addItem: (newItem) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === newItem.id);

        if (existingItem) {
          // Перевіряємо, щоб не додати більше, ніж є на складі
          const nextQuantity = existingItem.quantity + 1;
          if (nextQuantity > newItem.stock) return;

          set({
            items: items.map((item) =>
              item.id === newItem.id ? { ...item, quantity: nextQuantity } : item
            ),
          });
        } else {
          set({ items: [...items, { ...newItem, quantity: 1 }] });
        }
      },

      // Видалення товару з кошика
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      // Оновлення кількості вручную (наприклад, кнопками + та -)
      updateQuantity: (id, quantity) => {
        const { items } = get();
        const item = items.find((i) => i.id === id);
        if (!item) return;

        // Обмежуємо рамками складу та мінімумом в 1 шт
        const validQuantity = Math.max(1, Math.min(quantity, item.stock));

        set({
          items: items.map((i) =>
            i.id === id ? { ...i, quantity: validQuantity } : i
          ),
        });
      },

      // Повне очищення кошика
      clearCart: () => set({ items: [] }),

      // Рахуємо суму всього кошика
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      // Рахуємо загальну кількість одиниць товарів у кошику
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "vela-marketplace-cart", // Ключ у localStorage
    }
  )
);
