"use client";

import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { UploadZone } from "@/components/upload-zone";
import { StyleSelector } from "@/components/style-selector";
import { GenerateButton } from "@/components/generate-button";
import { LoadingAnimation } from "@/components/loading-animation";
import { ResultPreview } from "@/components/result-preview";
import { DownloadShare } from "@/components/download-share";
import { useUpload } from "@/hooks/use-upload";
import { useGenerationStatus } from "@/hooks/use-generation-status";
import { StyleTheme } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

type AppStep = "upload" | "loading" | "result";

export default function Home() {
  const { file, preview, error: uploadError, handleFile, clear: clearUpload } = useUpload();
  const [selectedStyle, setSelectedStyle] = useState<StyleTheme | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState<AppStep>("upload");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { status, imageUrl, error: genError } = useGenerationStatus(
    step === "loading" ? sessionId : null
  );

  if (step === "loading" && status === "ready" && imageUrl) {
    setStep("result");
  }

  const handleGenerate = async () => {
    if (!file || !selectedStyle) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("style", selectedStyle);

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to start generation");
      }

      const { sessionId: sid } = await res.json();
      setSessionId(sid);
      setStep("loading");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartOver = () => {
    clearUpload();
    setSelectedStyle(null);
    setSessionId(null);
    setStep("upload");
    setSubmitError(null);
  };

  const displayError = genError || submitError;

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <HeroSection />

              <div className="space-y-14">
                <UploadZone
                  preview={preview}
                  error={uploadError}
                  onFile={handleFile}
                  onClear={clearUpload}
                />

                {file && (
                  <StyleSelector
                    selected={selectedStyle}
                    onSelect={setSelectedStyle}
                  />
                )}

                {file && selectedStyle && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center"
                  >
                    <GenerateButton
                      disabled={!file || !selectedStyle}
                      loading={submitting}
                      onClick={handleGenerate}
                    />
                  </motion.div>
                )}

                {displayError && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-3 border border-[var(--color-error)]/30 max-w-md mx-auto"
                  >
                    <span className="text-xs tracking-wide text-[var(--color-error)]">
                      {displayError}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12"
            >
              <LoadingAnimation status={status} />

              {genError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 text-center"
                >
                  <div className="border border-[var(--color-error)]/30 py-3 px-6 max-w-sm mx-auto mb-4">
                    <span className="text-xs tracking-wide text-[var(--color-error)]">{genError}</span>
                  </div>
                  <button
                    onClick={handleStartOver}
                    className="text-[var(--color-gold)] hover:text-[var(--color-gold-light)] text-xs tracking-[0.15em] uppercase font-medium cursor-pointer transition-colors"
                  >
                    Try again
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === "result" && imageUrl && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
