"use client";

import { SiteTheme } from "@/lib/themes";

interface ThemeProviderProps {
  theme: SiteTheme;
  children: React.ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const style = {
    "--color-espresso": theme.colors.bg,
    "--color-charcoal": theme.colors.bgAlt,
    "--color-charcoal-light": theme.colors.border,
    "--color-parchment": theme.colors.text,
    "--color-warm-gray": theme.colors.textMuted,
    "--color-gold": theme.colors.accent,
    "--color-gold-light": theme.colors.accentLight,
    "--color-error": theme.colors.error,
    "--color-ink": theme.colors.bg,
    "--font-display": theme.displayFont,
  } as React.CSSProperties;

  return (
    <div style={style} className="min-h-screen bg-[var(--color-espresso)]">
      {children}
    </div>
  );
}
