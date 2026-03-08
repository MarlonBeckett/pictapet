"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useGenerationStatus } from "@/hooks/use-generation-status";
import { LoadingAnimation } from "@/components/loading-animation";
import { ResultGallery } from "@/components/result-gallery";
import { DownloadShare } from "@/components/download-share";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;
  const purchasedParam = searchParams.get("purchased") === "true";
  const { status, imageUrls, purchased, awaitingPurchase, generatingMore, error, waitForPurchase } = useGenerationStatus(sessionId);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  // If redirected back from Stripe, poll until webhook confirms purchase
  useEffect(() => {
    if (purchasedParam && !purchased) {
      waitForPurchase();
    }
  }, [purchasedParam, purchased, waitForPurchase]);

  const handleStartOver = () => {
    window.location.href = "/";
  };

  const handleToggleSelect = useCallback((index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  return (
    <>
      <Header />
      {error ? (
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <div className="border border-[var(--color-error)]/30 py-3 px-6 max-w-sm mx-auto mb-4">
              <span className="text-xs tracking-wide text-[var(--color-error)]">{error}</span>
            </div>
            <a
              href="/"
              className="text-[var(--color-gold)] hover:text-[var(--color-gold-light)] text-xs tracking-[0.15em] uppercase font-medium transition-colors"
            >
              Start over
            </a>
          </div>
        </main>
      ) : status !== "ready" || imageUrls.length === 0 ? (
        <main className="flex-1 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <LoadingAnimation status={status} />
          </div>
        </main>
      ) : (
        <main className="flex-1 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-12"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold)] mb-3">
                Your portrait is complete
              </p>
              <h2 className="font-[var(--font-serif)] text-3xl md:text-4xl text-[var(--color-parchment)]">
                A Masterpiece Awaits
              </h2>
            </motion.div>

            {awaitingPurchase && !purchased && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-3 mb-8 py-3 border border-[var(--color-gold)]/30 max-w-sm mx-auto"
              >
                <Loader2 className="w-4 h-4 text-[var(--color-gold)] animate-spin" />
                <span className="text-xs tracking-wider text-[var(--color-gold)] uppercase">
                  Confirming purchase...
                </span>
              </motion.div>
            )}

            <ResultGallery
              imageUrls={imageUrls}
              generatingMore={generatingMore}
              selectedIndices={selectedIndices}
              onToggleSelect={handleToggleSelect}
              purchased={purchased}
            />
            <DownloadShare
              imageUrls={imageUrls}
              selectedIndices={selectedIndices}
              onStartOver={handleStartOver}
              purchased={purchased}
              sessionId={sessionId}
            />
          </div>
        </main>
      )}
      <Footer />
    </>
  );
}
