"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface GenerateButtonProps {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
  label?: string;
}

export function GenerateButton({ disabled, loading, onClick, label = "Generate Portrait" }: GenerateButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!disabled && !loading ? { y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative flex items-center justify-center gap-3 py-4 px-12 font-medium text-sm tracking-widest uppercase transition-all duration-300 cursor-pointer
        ${disabled || loading
          ? "border border-[var(--color-charcoal-light)]/40 text-[var(--color-warm-gray)]/40 cursor-not-allowed"
          : "border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)]"
        }
      `}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Creating...</span>
        </>
      ) : (
        <span>{label}</span>
      )}
    </motion.button>
  );
}
