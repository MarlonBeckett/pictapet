"use client";

import { useState, useCallback } from "react";
// heic2any accesses `window` at module level — must be dynamically imported

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];

const HEIC_EXTENSIONS = [".heic", ".heif"];

function isAcceptedFile(file: File): boolean {
  if (ACCEPTED_TYPES.includes(file.type)) return true;
  const ext = file.name.toLowerCase().match(/\.\w+$/)?.[0];
  return ext ? ACCEPTED_EXTENSIONS.includes(ext) : false;
}

function isHeicFile(file: File): boolean {
  if (file.type === "image/heic" || file.type === "image/heif") return true;
  const ext = file.name.toLowerCase().match(/\.\w+$/)?.[0];
  return ext ? HEIC_EXTENSIONS.includes(ext) : false;
}

export function useUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);

  const handleFile = useCallback((acceptedFile: File) => {
    setError(null);

    if (!isAcceptedFile(acceptedFile)) {
      setError("Please upload a JPEG, PNG, WebP, or HEIC image.");
      return;
    }

    if (acceptedFile.size > MAX_SIZE) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    setFile(acceptedFile);

    if (isHeicFile(acceptedFile)) {
      // Browsers can't display HEIC — convert to JPEG for preview
      setConverting(true);
      import("heic2any").then(({ default: heic2any }) => heic2any({ blob: acceptedFile, toType: "image/jpeg", quality: 0.8 }))
        .then((result) => {
          const blob = Array.isArray(result) ? result[0] : result;
          setPreview(URL.createObjectURL(blob));
          setConverting(false);
        })
        .catch(() => {
          // Fallback: try objectURL anyway (some browsers may support it)
          setPreview(URL.createObjectURL(acceptedFile));
          setConverting(false);
        });
    } else {
      setPreview(URL.createObjectURL(acceptedFile));
    }
  }, []);

  const clear = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setError(null);
  }, [preview]);

  return { file, preview, error, converting, handleFile, clear };
}
