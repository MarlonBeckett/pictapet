"use client";

import { useState } from "react";
import { CartIcon } from "@/components/cart-icon";
import { CartDrawer } from "@/components/cart-drawer";

interface HeaderProps {
  subtitle?: string;
}

export function Header({ subtitle }: HeaderProps) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--color-espresso)]/80 border-b border-[var(--color-charcoal-light)]/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="transition-transform group-hover:rotate-[-8deg] duration-300">
              <ellipse cx="14" cy="18" rx="7" ry="6" fill="var(--color-gold)" opacity="0.8"/>
              <circle cx="8" cy="9" r="3" fill="var(--color-gold-light)"/>
              <circle cx="16" cy="7" r="3" fill="var(--color-gold-light)"/>
              <circle cx="22" cy="11" r="2.5" fill="var(--color-gold-light)"/>
              <circle cx="4" cy="13" r="2.5" fill="var(--color-gold-light)"/>
            </svg>
            <span className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--color-parchment)]">
              PictaPet
            </span>
            {subtitle && (
              <span className="hidden sm:block font-[var(--font-serif)] text-lg text-[var(--color-gold)] italic">
                {subtitle}
              </span>
            )}
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
              {subtitle ? `${subtitle} Edition` : "AI Portrait Studio"}
            </span>
            <CartIcon onClick={() => setCartOpen(true)} />
          </div>
        </div>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
