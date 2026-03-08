"use client";

import { useState, useCallback } from "react";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function useUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((acceptedFile: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(acceptedFile.type)) {
      setError("Please upload a JPEG, PNG, or WebP image.");
      return;
    }

    if (acceptedFile.size > MAX_SIZE) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    setFile(acceptedFile);
    const url = URL.createObjectURL(acceptedFile);
    setPreview(url);
  }, []);

  const clear = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setError(null);
  }, [preview]);

  return { file, preview, error, handleFile, clear };
}
