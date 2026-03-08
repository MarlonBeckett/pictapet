"use client";

import { motion } from "framer-motion";
import { Download, RotateCcw, Plus, Loader2, ShoppingCart } from "lucide-react";

interface DownloadShareProps {
  imageUrls: string[];
  selectedIndices: Set<number>;
  featuredIndex?: number;
  onStartOver: () => void;
  onGenerateAnother?: () => void;
  generatingMore?: boolean;
  maxImages?: number;
  purchasedIndices: number[];
  sessionId: string;
  onAddAllToCart?: () => void;
}

const MAX_IMAGES = 5;

export function DownloadShare({
  imageUrls,
  selectedIndices,
  featuredIndex = 0,
  onStartOver,
  onGenerateAnother,
  generatingMore = false,
  maxImages = MAX_IMAGES,
  purchasedIndices,
  sessionId,
  onAddAllToCart,
}: DownloadShareProps) {
  const downloadImage = async (url: string, index: number) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `pictapet-portrait-${index + 1}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  const downloadOriginal = async (index: number) => {
    const url = `/api/download/${sessionId}?index=${index}`;
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `pictapet-portrait-${index + 1}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  const downloadSingle = async (index: number) => {
    if (purchasedIndices.includes(index)) {
      await downloadOriginal(index);
    } else {
      await downloadImage(imageUrls[index], index);
    }
  };

  const handleDownload = async () => {
    if (selectedIndices.size > 0) {
      for (const idx of selectedIndices) {
        await downloadSingle(idx);
      }
    } else {
      await downloadSingle(featuredIndex);
    }
  };

  const handleDownloadAll = async () => {
    for (let i = 0; i < imageUrls.length; i++) {
      await downloadSingle(i);
    }
  };

  const handleDownloadAllPurchased = async () => {
    for (const idx of purchasedIndices) {
      await downloadOriginal(idx);
    }
  };

  const hasAnyPurchased = purchasedIndices.length > 0;
  const hasUnpurchased = imageUrls.some((_, i) => !purchasedIndices.includes(i));
  const canGenerateMore = imageUrls.length < maxImages && !generatingMore;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex flex-col items-center gap-4 mt-10"
    >
      {/* Download buttons - only shown after purchase */}
      {hasAnyPurchased && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-3 py-3.5 px-10 border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] text-sm tracking-widest uppercase font-medium transition-all duration-300 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {selectedIndices.size > 1 ? `Download ${selectedIndices.size}` : "Download"}
          </button>

          {purchasedIndices.length >= 2 && (
            <button
              onClick={handleDownloadAllPurchased}
              className="flex items-center justify-center gap-3 py-3.5 px-10 bg-[var(--color-gold)] text-[var(--color-ink)] hover:bg-[var(--color-gold-light)] text-sm tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download All Purchased
            </button>
          )}
        </div>
      )}

      {/* Add All to Cart */}
      {hasUnpurchased && onAddAllToCart && imageUrls.length >= 2 && (
        <button
          onClick={onAddAllToCart}
          className="flex items-center justify-center gap-3 py-3 px-8 border border-[var(--color-gold)]/40 text-[var(--color-gold)]/70 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] text-xs tracking-widest uppercase font-medium transition-all duration-300 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          Add All to Cart
        </button>
      )}

      {/* Secondary actions row */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onGenerateAnother && (
          <button
            onClick={onGenerateAnother}
            disabled={!canGenerateMore}
            className="flex items-center justify-center gap-3 py-3.5 px-10 border border-[var(--color-charcoal-light)] text-[var(--color-warm-gray)] hover:border-[var(--color-gold)]/50 hover:text-[var(--color-gold)] text-sm tracking-widest uppercase font-medium transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--color-charcoal-light)] disabled:hover:text-[var(--color-warm-gray)]"
          >
            {generatingMore ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {generatingMore
              ? "Generating..."
              : imageUrls.length >= maxImages
                ? `Max ${maxImages} Reached`
                : `Generate Another (${imageUrls.length}/${maxImages})`}
          </button>
        )}

        <button
          onClick={onStartOver}
          className="flex items-center justify-center gap-3 py-3.5 px-10 border border-[var(--color-charcoal-light)] text-[var(--color-warm-gray)] hover:border-[var(--color-warm-gray)] hover:text-[var(--color-parchment)] text-sm tracking-widest uppercase font-medium transition-all duration-300 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          New Portrait
        </button>
      </div>
    </motion.div>
  );
}
