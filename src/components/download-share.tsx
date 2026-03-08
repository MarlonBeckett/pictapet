"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw, Plus, Loader2, Lock } from "lucide-react";

interface DownloadShareProps {
  imageUrls: string[];
  selectedIndices: Set<number>;
  featuredIndex?: number;
  onStartOver: () => void;
  onGenerateAnother?: () => void;
  generatingMore?: boolean;
  maxImages?: number;
  purchased: boolean;
  sessionId: string;
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
  purchased,
  sessionId,
}: DownloadShareProps) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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

  const handleDownload = async () => {
    if (purchased) {
      if (selectedIndices.size > 0) {
        for (const idx of selectedIndices) {
          await downloadOriginal(idx);
        }
      } else {
        await downloadOriginal(featuredIndex);
      }
    } else {
      // Download watermarked preview
      if (selectedIndices.size > 0) {
        for (const idx of selectedIndices) {
          await downloadImage(imageUrls[idx], idx);
        }
      } else {
        await downloadImage(imageUrls[featuredIndex], featuredIndex);
      }
    }
  };

  const handleDownloadAll = async () => {
    for (let i = 0; i < imageUrls.length; i++) {
      if (purchased) {
        await downloadOriginal(i);
      } else {
        await downloadImage(imageUrls[i], i);
      }
    }
  };

  const handlePurchase = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const canGenerateMore = imageUrls.length < maxImages && !generatingMore;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex flex-col items-center gap-4 mt-10"
    >
      {/* Purchase CTA when not purchased */}
      {!purchased && (
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handlePurchase}
            disabled={checkoutLoading}
            className="flex items-center justify-center gap-3 py-4 px-12 bg-[var(--color-gold)] text-[var(--color-ink)] hover:bg-[var(--color-gold-light)] text-sm tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer disabled:opacity-60"
          >
            {checkoutLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            Purchase Portraits — $9.99
          </button>
          <p className="text-[10px] tracking-wider text-[var(--color-warm-gray)] uppercase">
            Remove watermarks & download in full resolution
          </p>
        </div>
      )}

      {/* Download buttons (only shown after purchase) */}
      {purchased && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-3 py-3.5 px-10 border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] text-sm tracking-widest uppercase font-medium transition-all duration-300 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {selectedIndices.size > 1 ? `Download ${selectedIndices.size}` : "Download"}
          </button>

          {imageUrls.length >= 2 && (
            <button
              onClick={handleDownloadAll}
              className="flex items-center justify-center gap-3 py-3.5 px-10 border border-[var(--color-gold)]/50 text-[var(--color-gold)]/80 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] text-sm tracking-widest uppercase font-medium transition-all duration-300 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download All
            </button>
          )}
        </div>
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
