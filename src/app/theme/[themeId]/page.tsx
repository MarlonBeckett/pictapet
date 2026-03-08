"use client";

import { useState, useCallback } from "react";
import { useParams, notFound } from "next/navigation";
import { getTheme } from "@/lib/themes";
import { ThemeProvider } from "@/components/theme-provider";
import { HeroSection } from "@/components/hero-section";
import { UploadZone } from "@/components/upload-zone";
import { GenerateButton } from "@/components/generate-button";
import { LoadingAnimation } from "@/components/loading-animation";
import { ResultGallery } from "@/components/result-gallery";
import { DownloadShare } from "@/components/download-share";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useUpload } from "@/hooks/use-upload";
import { useGenerationStatus } from "@/hooks/use-generation-status";
import { useCart } from "@/contexts/cart-context";
import { motion, AnimatePresence } from "framer-motion";

type AppStep = "upload" | "loading" | "result";

export default function ThemePage() {
  const params = useParams();
  const themeId = params.themeId as string;
  const theme = getTheme(themeId);

  const { file, preview, error: uploadError, converting, handleFile, clear: clearUpload } = useUpload();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState<AppStep>("upload");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [selectedSubRole, setSelectedSubRole] = useState<string>(
    theme?.subRoles[0]?.id ?? ""
  );

  const { status, imageUrls, purchasedIndices, generatingMore, error: genError, triggerPoll } = useGenerationStatus(
    step === "loading" || step === "result" ? sessionId : null
  );

  const { addToCart, isInCart } = useCart();

  if (!theme) {
    notFound();
  }

  if (step === "loading" && status === "ready" && imageUrls.length > 0) {
    setStep("result");
  }

  const handleGenerate = async () => {
    if (!file) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("style", theme.id);
      if (selectedSubRole) {
        formData.append("subRole", selectedSubRole);
      }

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

  const handleGenerateAnother = useCallback(async () => {
    if (!sessionId) return;

    try {
      const res = await fetch(`/api/regenerate/${sessionId}`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate another");
      }
      triggerPoll();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    }
  }, [sessionId, triggerPoll]);

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

  const handleAddToCart = useCallback((index: number) => {
    if (!sessionId) return;
    addToCart({
      sessionId,
      imageIndex: index,
      imageUrl: imageUrls[index],
      themeName: theme.name,
    });
  }, [sessionId, imageUrls, theme.name, addToCart]);

  const handleBuyNow = useCallback(async (index: number) => {
    if (!sessionId) return;
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ sessionId, imageIndex: index }],
      }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }, [sessionId]);

  const handleAddAllToCart = useCallback(() => {
    if (!sessionId) return;
    imageUrls.forEach((url, i) => {
      if (!purchasedIndices.includes(i)) {
        addToCart({
          sessionId,
          imageIndex: i,
          imageUrl: url,
          themeName: theme.name,
        });
      }
    });
  }, [sessionId, imageUrls, purchasedIndices, theme.name, addToCart]);

  const handleStartOver = () => {
    clearUpload();
    setSessionId(null);
    setStep("upload");
    setSubmitError(null);
    setSelectedIndices(new Set());
  };

  const displayError = genError || submitError;

  return (
    <ThemeProvider theme={theme}>
      <Header subtitle={theme.name} />
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
                <HeroSection
                  label={theme.copy.heroLabel}
                  heading={theme.copy.heroHeading}
                  subtext={theme.copy.heroSubtext}
                />

                <div className="space-y-14">
                  {/* Sub-role selector */}
                  <div className="max-w-2xl mx-auto">
                    <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-gold)] mb-4 text-center font-medium">
                      Choose Your Character
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {theme.subRoles.map((role) => (
                        <button
                          key={role.id}
                          onClick={() => setSelectedSubRole(role.id)}
                          className={`
                            group relative px-5 py-3 border transition-all duration-300 cursor-pointer
                            ${selectedSubRole === role.id
                              ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10"
                              : "border-[var(--color-charcoal-light)] hover:border-[var(--color-gold)]/40 bg-transparent"
                            }
                          `}
                        >
                          <span className="text-xl mb-1 block">{role.emoji}</span>
                          <span
                            className={`text-xs tracking-wide font-medium block ${
                              selectedSubRole === role.id
                                ? "text-[var(--color-gold)]"
                                : "text-[var(--color-parchment)]"
                            }`}
                          >
                            {role.name}
                          </span>
                          <span className="text-[10px] text-[var(--color-warm-gray)] block mt-0.5">
                            {role.description}
                          </span>
                          {selectedSubRole === role.id && (
                            <motion.div
                              layoutId="subrole-indicator"
                              className="absolute inset-0 border-2 border-[var(--color-gold)] pointer-events-none"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <UploadZone
                    preview={preview}
                    error={uploadError}
                    converting={converting}
                    onFile={handleFile}
                    onClear={clearUpload}
                  />

                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-center"
                    >
                      <GenerateButton
                        disabled={!file}
                        loading={submitting}
                        onClick={handleGenerate}
                        label={theme.subRoles.find(r => r.id === selectedSubRole)?.generateButton ?? theme.copy.generateButton}
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
                <LoadingAnimation
                  status={status}
                  steps={theme.copy.loadingSteps}
                />

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

            {step === "result" && imageUrls.length > 0 && (
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
                    {theme.copy.resultLabel}
                  </p>
                  <h2 className="font-[var(--font-serif)] text-3xl md:text-4xl text-[var(--color-parchment)]">
                    {theme.copy.resultHeading}
                  </h2>
                </motion.div>

                <ResultGallery
                  imageUrls={imageUrls}
                  generatingMore={generatingMore}
                  selectedIndices={selectedIndices}
                  onToggleSelect={handleToggleSelect}
                  purchasedIndices={purchasedIndices}
                  sessionId={sessionId!}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  isInCart={(index) => isInCart(sessionId!, index)}
                />
                <DownloadShare
                  imageUrls={imageUrls}
                  selectedIndices={selectedIndices}
                  onStartOver={handleStartOver}
                  onGenerateAnother={handleGenerateAnother}
                  generatingMore={generatingMore}
                  purchasedIndices={purchasedIndices}
                  sessionId={sessionId!}
                  onAddAllToCart={handleAddAllToCart}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer subtitle={theme.name} />
    </ThemeProvider>
  );
}
