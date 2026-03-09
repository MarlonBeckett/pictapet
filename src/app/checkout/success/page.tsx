"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import {
  Check,
  Loader2,
  Download,
  AlertTriangle,
  Palette,
} from "lucide-react";

interface SessionData {
  imageUrls: string[];
  purchasedIndices: number[];
  confirmed: boolean;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const sessionsParam = searchParams.get("sessions");
  const sessionIds = sessionsParam ? sessionsParam.split(",") : [];

  const [sessions, setSessions] = useState<Record<string, SessionData>>({});
  const [downloading, setDownloading] = useState(false);
  const cartCleared = useRef(false);

  // Clear cart once on mount
  useEffect(() => {
    if (!cartCleared.current) {
      clearCart();
      cartCleared.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll each session for purchase confirmation
  useEffect(() => {
    if (sessionIds.length === 0) return;

    const intervals: NodeJS.Timeout[] = [];

    for (const sid of sessionIds) {
      const poll = async () => {
        try {
          const res = await fetch(`/api/status/${sid}`);
          if (!res.ok) return;
          const data = await res.json();
          const purchased: number[] = data.purchasedIndices ?? [];

          setSessions((prev) => ({
            ...prev,
            [sid]: {
              imageUrls: data.imageUrls ?? [],
              purchasedIndices: purchased,
              confirmed: purchased.length > 0,
            },
          }));
        } catch {
          // keep polling
        }
      };

      poll();
      const interval = setInterval(poll, 2000);
      intervals.push(interval);
    }

    return () => intervals.forEach(clearInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionsParam]);

  // Stop polling sessions that are confirmed
  const allConfirmed =
    sessionIds.length > 0 &&
    sessionIds.every((sid) => sessions[sid]?.confirmed);

  const downloadOriginal = useCallback(
    async (sessionId: string, index: number) => {
      const url = `/api/download/${sessionId}?index=${index}`;
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `pictapet-portrait-${sessionId.slice(0, 6)}-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    },
    []
  );

  const handleDownloadAll = useCallback(async () => {
    setDownloading(true);
    try {
      for (const sid of sessionIds) {
        const data = sessions[sid];
        if (!data) continue;
        for (const idx of data.purchasedIndices) {
          await downloadOriginal(sid, idx);
        }
      }
    } finally {
      setDownloading(false);
    }
  }, [sessionIds, sessions, downloadOriginal]);

  // Collect all purchased images for display — use unwatermarked download endpoint
  const allImages: { sessionId: string; index: number; url: string }[] = [];
  for (const sid of sessionIds) {
    const data = sessions[sid];
    if (!data?.confirmed) continue;
    for (const idx of data.purchasedIndices) {
      allImages.push({
        sessionId: sid,
        index: idx,
        url: `/api/download/${sid}?index=${idx}&inline=true`,
      });
    }
  }

  // No sessions edge case
  if (sessionIds.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto px-6"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-600/20 flex items-center justify-center">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="font-[var(--font-serif)] text-3xl text-[var(--color-parchment)] mb-3">
          Purchase Confirmed!
        </h1>
        <p className="text-sm text-[var(--color-warm-gray)] mb-8 leading-relaxed">
          Your portraits are now unlocked.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center py-3.5 px-10 bg-[var(--color-gold)] text-[var(--color-ink)] text-sm tracking-widest uppercase font-bold hover:bg-[var(--color-gold-light)] transition-all duration-300"
        >
          Browse More Themes
        </a>
      </motion.div>
    );
  }

  // Waiting for purchase confirmation
  if (!allConfirmed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center max-w-md mx-auto px-6"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-600/20 flex items-center justify-center">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="font-[var(--font-serif)] text-2xl text-[var(--color-parchment)] mb-4">
          Purchase Confirmed
        </h1>
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-4 h-4 text-[var(--color-gold)] animate-spin" />
          <span className="text-xs tracking-wider text-[var(--color-warm-gray)] uppercase">
            Preparing your portraits for download...
          </span>
        </div>
      </motion.div>
    );
  }

  // All confirmed — show images + download
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-2xl mx-auto px-6"
    >
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-600/20 flex items-center justify-center">
        <Check className="w-8 h-8 text-green-500" />
      </div>
      <h1 className="font-[var(--font-serif)] text-3xl text-[var(--color-parchment)] mb-3">
        Your Portraits Are Ready!
      </h1>
      <p className="text-sm text-[var(--color-warm-gray)] mb-8 leading-relaxed">
        Download your full-resolution, watermark-free portraits below.
      </p>

      {/* Download All button */}
      {allImages.length > 0 && (
        <button
          onClick={handleDownloadAll}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-3 py-3.5 px-10 bg-[var(--color-gold)] text-[var(--color-ink)] text-sm tracking-widest uppercase font-bold hover:bg-[var(--color-gold-light)] transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mb-8"
        >
          {downloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {downloading
            ? "Downloading..."
            : allImages.length === 1
              ? "Download Portrait"
              : `Download All (${allImages.length})`}
        </button>
      )}

      {/* Image grid */}
      <div
        className={`grid gap-4 mb-8 ${
          allImages.length === 1
            ? "grid-cols-1 max-w-sm mx-auto"
            : allImages.length === 2
              ? "grid-cols-2 max-w-lg mx-auto"
              : "grid-cols-2 sm:grid-cols-3"
        }`}
      >
        {allImages.map(({ sessionId, index, url }) => (
          <div key={`${sessionId}-${index}`} className="relative group">
            <img
              src={url}
              alt={`Portrait ${index + 1}`}
              className="w-full aspect-[9/16] object-cover border border-[var(--color-charcoal-light)]"
            />
            <button
              onClick={() => downloadOriginal(sessionId, index)}
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            >
              <Download className="w-6 h-6 text-white" />
            </button>
          </div>
        ))}
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 border border-amber-600/30 bg-amber-900/10 mb-8 text-left">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-400/90 leading-relaxed">
          This is your only chance to download your portraits. Please save them
          now — they won&apos;t be available later.
        </p>
      </div>

      {/* Browse more */}
      <a
        href="/"
        className="inline-flex items-center justify-center gap-3 py-3.5 px-10 border border-[var(--color-charcoal-light)] text-[var(--color-warm-gray)] hover:border-[var(--color-gold)]/50 hover:text-[var(--color-gold)] text-sm tracking-widest uppercase font-medium transition-all duration-300"
      >
        <Palette className="w-4 h-4" />
        Browse More Themes
      </a>
    </motion.div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <Suspense fallback={null}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
