"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { CartItem } from "@/types";

interface CartContextValue {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (sessionId: string, imageIndex: number) => void;
  clearCart: () => void;
  clearPurchasedItems: (sessionId: string, indices: number[]) => void;
  isInCart: (sessionId: string, imageIndex: number) => boolean;
  itemCount: number;
  total: string;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "pictapet-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addToCart = useCallback((item: CartItem) => {
    setItems((prev) => {
      const exists = prev.some(
        (i) => i.sessionId === item.sessionId && i.imageIndex === item.imageIndex
      );
      if (exists) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((sessionId: string, imageIndex: number) => {
    setItems((prev) =>
      prev.filter((i) => !(i.sessionId === sessionId && i.imageIndex === imageIndex))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const clearPurchasedItems = useCallback((sessionId: string, indices: number[]) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.sessionId === sessionId && indices.includes(i.imageIndex))
      )
    );
  }, []);

  const isInCart = useCallback(
    (sessionId: string, imageIndex: number) => {
      return items.some(
        (i) => i.sessionId === sessionId && i.imageIndex === imageIndex
      );
    },
    [items]
  );

  const itemCount = items.length;
  const total = `$${((items.length * 999) / 100).toFixed(2)}`;

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, clearPurchasedItems, isInCart, itemCount, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
