import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import { toast } from "sonner";

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id"> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      get subtotal() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      addItem: (newItem) => {
        const id = newItem.id ?? `${newItem.productId}-${newItem.size ?? ""}-${newItem.color ?? ""}`;
        const item = { ...newItem, id };

        set((state) => {
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            const newQty = Math.min(existing.quantity + item.quantity, item.stock);
            if (newQty === existing.quantity) {
              toast.info("Maximum stock reached");
              return state;
            }
            toast.success("Cart updated");
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity: newQty } : i
              ),
            };
          }
          toast.success(`${item.name} added to cart`);
          return { items: [...state.items, item] };
        });
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        toast.success("Item removed from cart");
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "clothio-cart",
      version: 1,
    }
  )
);