import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

interface WishlistStore {
  items: string[]; // product IDs
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (productId) => {
        const exists = get().items.includes(productId);
        set((state) => ({
          items: exists
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        }));
        toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
      },

      has: (productId) => get().items.includes(productId),

      clear: () => set({ items: [] }),
    }),
    {
      name: "clothio-wishlist",
      version: 1,
    }
  )
);