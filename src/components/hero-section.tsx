"use client";

import { motion } from "framer-motion";

interface HeroSectionProps {
  label?: string;
  heading?: string;
  subtext?: string;
}

export function HeroSection({
  label = "AI Portrait Studio",
  heading = 'Your Pet,<br /><em>Transformed</em>',
  subtext = "Upload a photo. Choose a style. Receive a portrait worthy of a frame.",
}: HeroSectionProps) {
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
          {label}
        </p>

        <h1
          className="font-[var(--font-serif)] text-5xl md:text-7xl lg:text-8xl text-[var(--color-parchment)] mb-6 leading-[0.95] [&>em]:text-[var(--color-gold)]"
          dangerouslySetInnerHTML={{ __html: heading }}
        />

        <div className="ornament-line mx-auto mb-6" />

        <p className="text-base md:text-lg text-[var(--color-warm-gray)] max-w-md mx-auto leading-relaxed">
          {subtext}
        </p>
      </motion.div>
    </section>
  );
}
