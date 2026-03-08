"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

interface CartIconProps {
  onClick: () => void;
}

export function CartIcon({ onClick }: CartIconProps) {
  const { itemCount } = useCart();

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-[var(--color-warm-gray)] hover:text-[var(--color-gold)] transition-colors cursor-pointer"
      aria-label="Shopping cart"
    >
      <ShoppingBag className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[var(--color-gold)] text-[var(--color-ink)] text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
          {itemCount}
        </span>
      )}
    </button>
  );
}
