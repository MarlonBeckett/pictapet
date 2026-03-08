"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Loader2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/contexts/cart-context";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeFromCart, itemCount, total } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            sessionId: item.sessionId,
            imageIndex: item.imageIndex,
          })),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[var(--color-espresso)] border-l border-[var(--color-charcoal-light)] z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-charcoal-light)]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[var(--color-gold)]" />
                <span className="text-sm tracking-widest uppercase text-[var(--color-parchment)] font-medium">
                  Cart ({itemCount})
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-[var(--color-warm-gray)] hover:text-[var(--color-parchment)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-10 h-10 text-[var(--color-charcoal-light)] mb-4" />
                  <p className="text-sm text-[var(--color-warm-gray)]">Your cart is empty</p>
                  <p className="text-xs text-[var(--color-warm-gray)]/60 mt-1">
                    Add portraits to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.sessionId}-${item.imageIndex}`}
                      className="flex gap-3 p-3 border border-[var(--color-charcoal-light)] bg-[var(--color-charcoal)]/30"
                    >
                      <div className="relative w-12 aspect-[9/16] overflow-hidden flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={`${item.themeName} portrait`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs tracking-wider text-[var(--color-parchment)] font-medium uppercase truncate">
                          {item.themeName}
                        </p>
                        <p className="text-[10px] text-[var(--color-warm-gray)] mt-0.5">
                          Portrait #{item.imageIndex + 1}
                        </p>
                        <p className="text-xs text-[var(--color-gold)] mt-1 font-medium">$9.99</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.sessionId, item.imageIndex)}
                        className="self-start p-1 text-[var(--color-warm-gray)] hover:text-[var(--color-error)] transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-t border-[var(--color-charcoal-light)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs tracking-wider uppercase text-[var(--color-warm-gray)]">
                    {itemCount} portrait{itemCount !== 1 ? "s" : ""}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-gold)]">{total}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full py-3.5 bg-[var(--color-gold)] text-[var(--color-ink)] text-sm tracking-widest uppercase font-bold hover:bg-[var(--color-gold-light)] transition-all duration-300 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Checkout"
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="w-full mt-2 py-2 text-xs tracking-wider text-[var(--color-warm-gray)] hover:text-[var(--color-parchment)] uppercase transition-colors cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
