"use client";

import { motion } from "framer-motion";
import { Download, RotateCcw } from "lucide-react";

interface DownloadShareProps {
  imageUrl: string;
  onStartOver: () => void;
}

export function DownloadShare({ imageUrl, onStartOver }: DownloadShareProps) {
  const handleDownload = async () => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pictapet-portrait.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex flex-col sm:flex-row gap-3 justify-center mt-10"
    >
      <button
        onClick={handleDownload}
        className="flex items-center justify-center gap-3 py-3.5 px-10 border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] text-sm tracking-widest uppercase font-medium transition-all duration-300 cursor-pointer"
      >
        <Download className="w-4 h-4" />
        Download
      </button>
      <button
        onClick={onStartOver}
        className="flex items-center justify-center gap-3 py-3.5 px-10 border border-[var(--color-charcoal-light)] text-[var(--color-warm-gray)] hover:border-[var(--color-warm-gray)] hover:text-[var(--color-parchment)] text-sm tracking-widest uppercase font-medium transition-all duration-300 cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        New Portrait
      </button>
    </motion.div>
  );
}
