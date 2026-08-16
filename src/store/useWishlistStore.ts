import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  id: string;
  title: string;
  price: number;
  slug: string;
  imageUrl?: string;
}

interface WishlistState {
  items: WishlistItem[];
  setItems: (items: WishlistItem[]) => void;
  toggleItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (items) => set({ items }),
      toggleItem: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        if (exists) {
          set({ items: get().items.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
    }),
    {
      name: "ukrtradehub-wishlist-storage",
    }
  )
);
