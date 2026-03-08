"use client";

import { motion } from "framer-motion";
import { StyleThemeConfig } from "@/types";

interface StyleCardProps {
  config: StyleThemeConfig;
  selected: boolean;
  onSelect: () => void;
}

export function StyleCard({ config, selected, onSelect }: StyleCardProps) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`
        relative text-left cursor-pointer transition-all duration-300 group
        border p-4 md:p-5
        ${selected
          ? "border-[var(--color-gold)] bg-[var(--color-gold)]/[0.06]"
          : "border-[var(--color-charcoal-light)]/60 hover:border-[var(--color-gold)]/40 bg-[var(--color-charcoal)]/20 hover:bg-[var(--color-charcoal)]/40"
        }
      `}
    >
      {/* Gold corner accent when selected */}
      {selected && (
        <>
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--color-gold)]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--color-gold)]" />
        </>
      )}

      <span className="text-2xl block mb-2">{config.emoji}</span>
      <h3 className={`text-sm font-medium mb-1 transition-colors duration-200 ${
        selected ? "text-[var(--color-gold)]" : "text-[var(--color-parchment)] group-hover:text-[var(--color-gold-light)]"
      }`}>
        {config.name}
      </h3>
      <p className="text-[11px] leading-relaxed text-[var(--color-warm-gray)]/70">
        {config.description}
      </p>
    </motion.button>
  );
}
