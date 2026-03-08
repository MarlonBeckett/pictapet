"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SessionStatus } from "@/types";

interface GenerationStatus {
  status: SessionStatus | null;
  imageUrl: string | null;
  error: string | null;
  isPolling: boolean;
}

export function useGenerationStatus(sessionId: string | null): GenerationStatus {
  const [status, setStatus] = useState<SessionStatus | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  useEffect(() => {
    if (!sessionId) {
      stopPolling();
      return;
    }

    setIsPolling(true);
    setStatus("analyzing");
    setError(null);
    setImageUrl(null);

    const poll = async () => {
      try {
        const res = await fetch(`/api/status/${sessionId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch status");
        }
        const data = await res.json();

        setStatus(data.status);

        if (data.status === "ready" && data.imageUrl) {
          setImageUrl(data.imageUrl);
          stopPolling();
        } else if (data.status === "error") {
          setError(data.error || "Generation failed");
          stopPolling();
        }
      } catch {
        setError("Connection lost. Please refresh the page.");
        stopPolling();
      }
    };

    // Poll immediately, then every 2 seconds
    poll();
    intervalRef.current = setInterval(poll, 2000);

    return () => stopPolling();
  }, [sessionId, stopPolling]);

  return { status, imageUrl, error, isPolling };
}
