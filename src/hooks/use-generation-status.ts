"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SessionStatus } from "@/types";

interface GenerationStatus {
  status: SessionStatus | null;
  imageUrls: string[];
  generatingMore: boolean;
  error: string | null;
  isPolling: boolean;
  triggerPoll: () => void;
}

export function useGenerationStatus(sessionId: string | null): GenerationStatus {
  const [status, setStatus] = useState<SessionStatus | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [generatingMore, setGeneratingMore] = useState(false);
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

  const startPolling = useCallback((sid: string) => {
    if (intervalRef.current) return;
    setIsPolling(true);

    const poll = async () => {
      try {
        const res = await fetch(`/api/status/${sid}`);
        if (!res.ok) throw new Error("Failed to fetch status");
        const data = await res.json();

        setStatus(data.status);
        setImageUrls(data.imageUrls ?? []);
        setGeneratingMore(data.generatingMore ?? false);

        if (data.status === "ready" && !data.generatingMore) {
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

    poll();
    intervalRef.current = setInterval(poll, 2000);
  }, [stopPolling]);

  // Start polling when sessionId changes (initial generation)
  useEffect(() => {
    if (!sessionId) {
      stopPolling();
      return;
    }

    setStatus("analyzing");
    setError(null);
    setImageUrls([]);
    setGeneratingMore(false);
    startPolling(sessionId);

    return () => stopPolling();
  }, [sessionId, stopPolling, startPolling]);

  // Resume polling when generatingMore becomes true (after regenerate call)
  const triggerPoll = useCallback(() => {
    if (sessionId && !intervalRef.current) {
      startPolling(sessionId);
    }
  }, [sessionId, startPolling]);

  return { status, imageUrls, generatingMore, error, isPolling, triggerPoll };
}
