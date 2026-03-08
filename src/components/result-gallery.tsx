"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Check, Loader2 } from "lucide-react";

interface ResultGalleryProps {
  imageUrls: string[];
  generatingMore: boolean;
  selectedIndices: Set<number>;
  onToggleSelect: (index: number) => void;
}

export function ResultGallery({
  imageUrls,
  generatingMore,
  selectedIndices,
  onToggleSelect,
}: ResultGalleryProps) {
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Auto-focus newly added image
  useEffect(() => {
    if (imageUrls.length > 0) {
      setFeaturedIndex(imageUrls.length - 1);
    }
  }, [imageUrls.length]);

  const featuredUrl = imageUrls[featuredIndex];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Featured image with museum frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative">
          <div className="absolute -inset-4 border border-[var(--color-gold)]/20" />
          <div className="absolute -inset-2 border border-[var(--color-gold)]/10" />
          <div className="absolute -inset-4 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]" />

          <AnimatePresence mode="wait">
            <motion.div
              key={featuredUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square overflow-hidden bg-[var(--color-charcoal)]"
            >
              {featuredUrl && (
                <Image
                  src={featuredUrl}
                  alt="Generated pet portrait"
                  fill
                  className="object-cover"
                  priority
                />
              )}
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.2)]" />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Plaque */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <div className="ornament-line mx-auto mb-3" />
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-warm-gray)]">
          Portrait {featuredIndex + 1} of {imageUrls.length}
          {imageUrls.length > 1 ? " \u2014 Click thumbnails to browse" : ""}
        </p>
      </motion.div>

      {/* Thumbnail strip */}
      {(imageUrls.length > 1 || generatingMore) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-6 flex justify-center gap-3"
        >
          {imageUrls.map((url, i) => (
            <button
              key={url}
              onClick={() => setFeaturedIndex(i)}
              className={`relative w-16 h-16 overflow-hidden border-2 transition-all duration-200 cursor-pointer group ${
                i === featuredIndex
                  ? "border-[var(--color-gold)] shadow-[0_0_12px_rgba(var(--color-gold-rgb),0.3)]"
                  : "border-[var(--color-charcoal-light)] hover:border-[var(--color-warm-gray)]"
              }`}
            >
              <Image
                src={url}
                alt={`Portrait ${i + 1}`}
                fill
                className="object-cover"
              />
              {/* Selection checkbox overlay */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect(i);
                }}
                className={`absolute top-0.5 right-0.5 w-5 h-5 rounded-sm flex items-center justify-center transition-all ${
                  selectedIndices.has(i)
                    ? "bg-[var(--color-gold)] text-[var(--color-ink)]"
                    : "bg-black/50 text-transparent group-hover:text-[var(--color-warm-gray)]"
                }`}
              >
                <Check className="w-3 h-3" />
              </div>
            </button>
          ))}

          {/* Loading placeholder for new generation */}
          {generatingMore && (
            <div className="w-16 h-16 border-2 border-dashed border-[var(--color-charcoal-light)] flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-[var(--color-warm-gray)] animate-spin" />
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
