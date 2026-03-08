"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface UploadZoneProps {
  preview: string | null;
  error: string | null;
  converting?: boolean;
  onFile: (file: File) => void;
  onClear: () => void;
}

export function UploadZone({ preview, error, converting, onFile, onClear }: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFile(acceptedFiles[0]);
      }
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [], "image/heic": [".heic"], "image/heif": [".heif"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const dropzoneProps = getRootProps();

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {converting && !preview ? (
          <motion.div
            key="converting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative border border-dashed border-[var(--color-charcoal-light)] aspect-square flex flex-col items-center justify-center bg-[var(--color-charcoal)]/30"
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[var(--color-gold)]/40" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[var(--color-gold)]/40" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[var(--color-gold)]/40" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[var(--color-gold)]/40" />

            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-[var(--color-gold)]/60 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[var(--color-warm-gray)] tracking-wide">
                Converting image…
              </p>
            </div>
          </motion.div>
        ) : preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative group"
          >
            {/* Frame effect */}
            <div className="absolute -inset-3 border border-[var(--color-gold)]/20 pointer-events-none" />
            <div className="absolute -inset-1.5 border border-[var(--color-gold)]/10 pointer-events-none" />

            <div className="relative aspect-square overflow-hidden bg-[var(--color-charcoal)]">
              <Image
                src={preview}
                alt="Pet photo preview"
                fill
                className="object-cover"
              />
              {/* Subtle vignette overlay */}
              <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.3)]" />
            </div>
            <button
              onClick={onClear}
              className="absolute top-3 right-3 p-2 bg-[var(--color-ink)]/70 hover:bg-[var(--color-ink)]/90 text-[var(--color-parchment)] transition-all cursor-pointer opacity-0 group-hover:opacity-100 duration-200"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Label below frame */}
            <div className="mt-4 text-center">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-warm-gray)]">
                Your subject
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...dropzoneProps}
              className={`
                relative border transition-all duration-300 cursor-pointer aspect-square flex flex-col items-center justify-center
                ${isDragActive
                  ? "border-[var(--color-gold)] bg-[var(--color-gold)]/[0.04]"
                  : "border-dashed border-[var(--color-charcoal-light)] hover:border-[var(--color-gold)]/50 bg-[var(--color-charcoal)]/30"
                }
              `}
            >
              <input {...getInputProps()} />

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[var(--color-gold)]/40" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[var(--color-gold)]/40" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[var(--color-gold)]/40" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[var(--color-gold)]/40" />

              <div className="flex flex-col items-center gap-5 px-8">
                {/* Upload icon — custom crosshair style */}
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={`transition-colors duration-300 ${isDragActive ? 'text-[var(--color-gold)]' : 'text-[var(--color-warm-gray)]'}`}>
                  <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
                  <line x1="20" y1="4" x2="20" y2="14" stroke="currentColor" strokeWidth="1"/>
                  <line x1="20" y1="26" x2="20" y2="36" stroke="currentColor" strokeWidth="1"/>
                  <line x1="4" y1="20" x2="14" y2="20" stroke="currentColor" strokeWidth="1"/>
                  <line x1="26" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1"/>
                  <line x1="20" y1="14" x2="16" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="20" y1="14" x2="24" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>

                <div className="text-center">
                  <p className="text-sm font-medium text-[var(--color-parchment)] mb-1">
                    {isDragActive ? "Release to upload" : "Drop your pet's photo here"}
                  </p>
                  <p className="text-xs text-[var(--color-warm-gray)]/70">
                    or click to browse &middot; JPG, PNG, WebP, HEIC &middot; 10MB max
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[var(--color-error)] text-xs mt-4 text-center tracking-wide"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
