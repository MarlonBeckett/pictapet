"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ResultPreviewProps {
  imageUrl: string;
}

export function ResultPreview({ imageUrl }: ResultPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-lg mx-auto"
    >
      {/* Museum-style frame */}
      <div className="relative">
        {/* Outer frame */}
        <div className="absolute -inset-4 border border-[var(--color-gold)]/20" />
        <div className="absolute -inset-2 border border-[var(--color-gold)]/10" />

        {/* Shadow / mat effect */}
        <div className="absolute -inset-4 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]" />

        <div className="relative aspect-square overflow-hidden bg-[var(--color-charcoal)]">
          <Image
            src={imageUrl}
            alt="Generated pet portrait"
            fill
            className="object-cover"
            priority
          />
          {/* Subtle vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.2)]" />
        </div>
      </div>

      {/* Plaque */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <div className="ornament-line mx-auto mb-3" />
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-warm-gray)]">
          Portrait by PictaPet
        </p>
      </motion.div>
    </motion.div>
  );
}
