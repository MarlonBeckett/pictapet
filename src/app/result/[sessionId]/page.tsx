"use client";

import { useParams } from "next/navigation";
import { useGenerationStatus } from "@/hooks/use-generation-status";
import { LoadingAnimation } from "@/components/loading-animation";
import { ResultPreview } from "@/components/result-preview";
import { DownloadShare } from "@/components/download-share";
import { motion } from "framer-motion";

export default function ResultPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const { status, imageUrl, error } = useGenerationStatus(sessionId);

  const handleStartOver = () => {
    window.location.href = "/";
  };

  if (error) {
    return (
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
    );
  }

  if (status !== "ready" || !imageUrl) {
    return (
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <LoadingAnimation status={status} />
        </div>
      </main>
    );
  }

  return (
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

        <ResultPreview imageUrl={imageUrl} />
        <DownloadShare imageUrl={imageUrl} onStartOver={handleStartOver} />
      </div>
    </main>
  );
}
