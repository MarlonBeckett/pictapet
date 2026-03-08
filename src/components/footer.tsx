"use client";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-charcoal-light)]/40 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="ornament-line" />
          <span className="font-[var(--font-serif)] text-sm text-[var(--color-warm-gray)] italic">
            PictaPet
          </span>
          <div className="ornament-line" />
        </div>
        <p className="text-xs tracking-widest uppercase text-[var(--color-warm-gray)]/60">
          Every pet deserves a portrait
        </p>
      </div>
    </footer>
  );
}
