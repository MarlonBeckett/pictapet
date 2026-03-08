"use client";

import { motion } from "framer-motion";
import { StyleCard } from "./style-card";
import { STYLE_THEMES } from "@/lib/prompt-engine";
import { StyleTheme } from "@/types";

interface StyleSelectorProps {
  selected: StyleTheme | null;
  onSelect: (style: StyleTheme) => void;
}

export function StyleSelector({ selected, onSelect }: StyleSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-[var(--color-charcoal-light)]/40" />
        <h2 className="font-[var(--font-serif)] text-xl text-[var(--color-parchment)] text-center">
          Choose a Style
        </h2>
        <div className="h-px flex-1 bg-[var(--color-charcoal-light)]/40" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 stagger-children">
        {STYLE_THEMES.map((theme) => (
          <StyleCard
            key={theme.id}
            config={theme}
            selected={selected === theme.id}
            onSelect={() => onSelect(theme.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}
