"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Check, Loader2, ShoppingCart, ShoppingBag } from "lucide-react";

interface ResultGalleryProps {
  imageUrls: string[];
  generatingMore: boolean;
  selectedIndices: Set<number>;
  onToggleSelect: (index: number) => void;
  purchasedIndices: number[];
  sessionId: string;
  onAddToCart: (index: number) => void;
  onBuyNow: (index: number) => void;
  isInCart: (index: number) => boolean;
}

export function ResultGallery({
  imageUrls,
  generatingMore,
  selectedIndices,
  onToggleSelect,
  purchasedIndices,
  sessionId,
  onAddToCart,
  onBuyNow,
  isInCart,
}: ResultGalleryProps) {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  useEffect(() => {
    if (imageUrls.length > 0) {
      setFeaturedIndex(imageUrls.length - 1);
    }
  }, [imageUrls.length]);

  const getDisplayUrl = (index: number) => {
    if (purchasedIndices.includes(index)) {
      return `/api/download/${sessionId}?index=${index}&inline=true`;
    }
    return imageUrls[index];
  };

  const featuredUrl = getDisplayUrl(featuredIndex);
  const isFeaturedPurchased = purchasedIndices.includes(featuredIndex);
  const isFeaturedInCart = isInCart(featuredIndex);

  const handleBuyNow = async () => {
    setBuyNowLoading(true);
    try {
      await onBuyNow(featuredIndex);
    } finally {
      setBuyNowLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Featured image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${featuredIndex}-${isFeaturedPurchased}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-[9/16] overflow-hidden bg-[var(--color-charcoal)]"
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
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Purchase actions below featured image */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 flex flex-col items-center gap-3"
      >
        {isFeaturedPurchased ? (
          <div className="flex items-center gap-2 py-2 px-6 border border-green-600/40 text-green-500">
            <Check className="w-4 h-4" />
            <span className="text-xs tracking-widest uppercase font-medium">Purchased</span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onAddToCart(featuredIndex)}
              disabled={isFeaturedInCart}
              className="flex items-center justify-center gap-2 py-3 px-8 border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] text-xs tracking-widest uppercase font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-[var(--color-gold)]"
            >
              <ShoppingCart className="w-4 h-4" />
              {isFeaturedInCart ? "In Cart" : "Add to Cart — $9.99"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={buyNowLoading}
              className="flex items-center justify-center gap-2 py-3 px-8 bg-[var(--color-gold)] text-[var(--color-ink)] hover:bg-[var(--color-gold-light)] text-xs tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer disabled:opacity-60"
            >
              {buyNowLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
              Buy Now — $9.99
            </button>
          </div>
        )}
      </motion.div>

      {/* Plaque */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6 text-center"
      >
        <div className="ornament-line mx-auto mb-3" />
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-warm-gray)]">
          Portrait {featuredIndex + 1} of {imageUrls.length}
          {imageUrls.length > 1 ? " \u2014 Click thumbnails to browse" : ""}
        </p>
        {!isFeaturedPurchased && (
          <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold)]/60 mt-2">
            Preview \u2014 Watermark removed after purchase
          </p>
        )}
      </motion.div>

      {/* Thumbnail strip */}
      {(imageUrls.length > 1 || generatingMore) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-6 flex justify-center gap-3"
        >
          {imageUrls.map((url, i) => {
            const isPurchased = purchasedIndices.includes(i);
            const inCart = isInCart(i);
            const thumbUrl = getDisplayUrl(i);
            return (
              <button
                key={`${i}-${isPurchased}`}
                onClick={() => setFeaturedIndex(i)}
                className={`relative w-12 aspect-[9/16] overflow-hidden border-2 transition-all duration-200 cursor-pointer group ${
                  i === featuredIndex
                    ? "border-[var(--color-gold)] shadow-[0_0_12px_rgba(var(--color-gold-rgb),0.3)]"
                    : "border-[var(--color-charcoal-light)] hover:border-[var(--color-warm-gray)]"
                }`}
              >
                <Image
                  src={thumbUrl}
                  alt={`Portrait ${i + 1}`}
                  fill
                  className="object-cover"
                />
                {/* Status badge */}
                {isPurchased ? (
                  <div className="absolute top-0.5 right-0.5 w-5 h-5 rounded-sm flex items-center justify-center bg-green-600 text-white">
                    <Check className="w-3 h-3" />
                  </div>
                ) : inCart ? (
                  <div className="absolute top-0.5 right-0.5 w-5 h-5 rounded-sm flex items-center justify-center bg-[var(--color-gold)] text-[var(--color-ink)]">
                    <ShoppingCart className="w-3 h-3" />
                  </div>
) : null}
              </button>
            );
          })}

          {generatingMore && (
            <div className="w-12 aspect-[9/16] border-2 border-dashed border-[var(--color-charcoal-light)] flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-[var(--color-warm-gray)] animate-spin" />
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
