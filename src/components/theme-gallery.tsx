"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { THEME_LIST, SiteTheme } from "@/lib/themes";

function ThemeCard({ theme, index }: { theme: SiteTheme; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/theme/${theme.id}`}
        className="group block relative overflow-hidden border border-[var(--color-charcoal-light)] hover:border-[var(--color-gold)]/60 transition-all duration-500"
        style={{
          backgroundColor: theme.colors.bg,
        }}
      >
        {/* Colored accent bar at top */}
        <div
          className="h-1 w-full transition-all duration-500 group-hover:h-1.5"
          style={{ backgroundColor: theme.colors.accent }}
        />

        <div className="p-6 md:p-8">
          {/* Emoji + theme name */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-3xl mb-2 block">{theme.emoji}</span>
              <h3
                className="text-xl md:text-2xl font-bold tracking-tight"
                style={{
                  fontFamily: theme.displayFont,
                  color: theme.colors.text,
                }}
              >
                {theme.name}
              </h3>
            </div>
            {/* Arrow icon */}
            <div
              className="mt-1 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
              style={{ backgroundColor: theme.colors.accent }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M8 2l5 5-5 5" stroke={theme.colors.bg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Tagline */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: theme.colors.textMuted }}
          >
            {theme.tagline}
          </p>

          {/* Color swatches */}
          <div className="flex items-center gap-1.5 mt-5">
            {[theme.colors.bg, theme.colors.bgAlt, theme.colors.accent, theme.colors.accentLight, theme.colors.text].map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border border-white/10"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ThemeGallery() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6 font-medium">
            Choose Your World
          </p>
          <h2 className="font-[var(--font-serif)] text-4xl md:text-5xl lg:text-6xl text-[var(--color-parchment)] mb-4 leading-[0.95]">
            Pick a Theme
          </h2>
          <div className="ornament-line mx-auto mb-6" />
          <p className="text-base text-[var(--color-warm-gray)] max-w-lg mx-auto">
            Each theme transforms your pet into a completely different world — custom colors, vibes, and AI portraits.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {THEME_LIST.map((theme, i) => (
            <ThemeCard key={theme.id} theme={theme} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
