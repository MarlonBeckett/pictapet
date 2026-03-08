"use client";

import { motion } from "framer-motion";
import { SessionStatus } from "@/types";

const DEFAULT_STEPS: [string, string, string] = [
  "Studying your pet",
  "Painting the portrait",
  "Final brushstrokes",
];

interface LoadingAnimationProps {
  status: SessionStatus | null;
  steps?: [string, string, string];
}

export function LoadingAnimation({ status, steps = DEFAULT_STEPS }: LoadingAnimationProps) {
  const stages = [
    { status: "analyzing", label: steps[0], numeral: "I" },
    { status: "generating", label: steps[1], numeral: "II" },
    { status: "ready", label: steps[2], numeral: "III" },
  ];

  const currentIndex = stages.findIndex((s) => s.status === status);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-sm mx-auto py-20 flex flex-col items-center"
    >
      {/* Animated frame being drawn */}
      <div className="relative w-40 h-40 mb-12">
        {/* Outer rotating frame corners */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[var(--color-gold)]/60" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--color-gold)]/60" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--color-gold)]/60" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[var(--color-gold)]/60" />
        </motion.div>

        {/* Inner pulsing frame */}
        <motion.div
          className="absolute inset-6 border border-[var(--color-gold)]/30"
          animate={{
            borderColor: ["rgba(200,165,92,0.2)", "rgba(200,165,92,0.5)", "rgba(200,165,92,0.2)"],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-2 h-2 rounded-full bg-[var(--color-gold)]"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="w-full space-y-0">
        {stages.map((stage, i) => {
          const isActive = i === currentIndex;
          const isDone = i < currentIndex;

          return (
            <motion.div
              key={stage.status}
              className="flex items-center gap-4 py-3 border-b border-[var(--color-charcoal-light)]/20 last:border-0"
              animate={{ opacity: isDone || isActive ? 1 : 0.25 }}
              transition={{ duration: 0.3 }}
            >
              <span className={`font-[var(--font-serif)] text-sm w-8 ${
                isDone ? "text-[var(--color-gold)]" : isActive ? "text-[var(--color-gold)]" : "text-[var(--color-charcoal-light)]"
              }`}>
                {stage.numeral}
              </span>

              <span className={`text-sm tracking-wide flex-1 ${
                isActive ? "text-[var(--color-parchment)]" : isDone ? "text-[var(--color-warm-gray)]" : "text-[var(--color-charcoal-light)]"
              }`}>
                {stage.label}
              </span>

              {isDone && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-4 h-px bg-[var(--color-gold)]"
                />
              )}

              {isActive && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="mt-8 text-[11px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]/50">
        This may take 15-30 seconds
      </p>
    </motion.div>
  );
}
