"use client";

import { Facebook, Instagram } from "lucide-react";

interface FooterProps {
  subtitle?: string;
}

export function Footer({ subtitle }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-[var(--color-charcoal-light)]/40 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="ornament-line" />
          <span className="font-[var(--font-serif)] text-sm text-[var(--color-warm-gray)] italic">
            PictaPet{subtitle ? ` ${subtitle}` : ""}
          </span>
          <div className="ornament-line" />
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.facebook.com/people/Picta-Pet/61582433127128/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-warm-gray)]/60 hover:text-[var(--color-warm-gray)] transition-colors"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://www.instagram.com/pictapet?igsh=MWQwNnUyaTYxcWdzcw%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-warm-gray)]/60 hover:text-[var(--color-warm-gray)] transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
        <p className="text-xs tracking-widest uppercase text-[var(--color-warm-gray)]/60">
          Every pet deserves a portrait
        </p>
      </div>
    </footer>
  );
}
