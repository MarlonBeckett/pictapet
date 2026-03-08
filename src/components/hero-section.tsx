"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="pt-20 md:pt-32 pb-16 md:pb-24 text-center relative">
      {/* Subtle radial glow behind hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[var(--color-gold)]/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6 font-medium">
          AI Portrait Studio
        </p>

        <h1 className="font-[var(--font-serif)] text-5xl md:text-7xl lg:text-8xl text-[var(--color-parchment)] mb-6 leading-[0.95]">
          Your Pet,<br />
          <em className="text-[var(--color-gold)]">Immortalized</em>
        </h1>

        <div className="ornament-line mx-auto mb-6" />

        <p className="text-base md:text-lg text-[var(--color-warm-gray)] max-w-md mx-auto leading-relaxed">
          Upload a photo. Choose a style.<br className="hidden md:block" />
          Receive a portrait worthy of a frame.
        </p>
      </motion.div>

      <motion.div
        className="flex items-center justify-center gap-8 mt-14 text-[var(--color-warm-gray)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {["Upload", "Style", "Generate", "Download"].map((label, i) => (
          <div key={label} className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-[var(--color-gold)]/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-xs tracking-wide">{label}</span>
            </div>
            {i < 3 && (
              <div className="w-8 h-px bg-[var(--color-charcoal-light)]" />
            )}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
