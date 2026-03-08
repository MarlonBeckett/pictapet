"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SessionStatus } from "@/types";

interface GenerationStatus {
  status: SessionStatus | null;
  imageUrls: string[];
  purchasedIndices: number[];
  awaitingPurchase: boolean;
  generatingMore: boolean;
  error: string | null;
  isPolling: boolean;
  triggerPoll: () => void;
  waitForPurchase: (indices: number[]) => void;
  isImagePurchased: (index: number) => boolean;
}

export function useGenerationStatus(sessionId: string | null): GenerationStatus {
  const [status, setStatus] = useState<SessionStatus | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [purchasedIndices, setPurchasedIndices] = useState<number[]>([]);
  const [awaitingPurchase, setAwaitingPurchase] = useState(false);
  const [generatingMore, setGeneratingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const awaitedIndicesRef = useRef<number[]>([]);

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
        setPurchasedIndices(data.purchasedIndices ?? []);
        setGeneratingMore(data.generatingMore ?? false);

        // Check if all awaited indices are now purchased
        const currentPurchased: number[] = data.purchasedIndices ?? [];
        if (awaitedIndicesRef.current.length > 0) {
          const allPurchased = awaitedIndicesRef.current.every((idx) =>
            currentPurchased.includes(idx)
          );
          if (allPurchased) {
            awaitedIndicesRef.current = [];
            setAwaitingPurchase(false);
          }
        }

        // Keep polling if awaiting purchase confirmation
        if (awaitedIndicesRef.current.length > 0) {
          return;
        }

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
    intervalRef.current = setInterval(poll, 1500);
  }, [stopPolling]);

  useEffect(() => {
    stopPolling();

    if (!sessionId) {
      setStatus(null);
      setError(null);
      setImageUrls([]);
      setPurchasedIndices([]);
      setAwaitingPurchase(false);
      awaitedIndicesRef.current = [];
      setGeneratingMore(false);
      return;
    }

    setStatus("analyzing");
    setError(null);
    setImageUrls([]);
    setPurchasedIndices([]);
    setAwaitingPurchase(false);
    awaitedIndicesRef.current = [];
    setGeneratingMore(false);
    startPolling(sessionId);

    return () => stopPolling();
  }, [sessionId, stopPolling, startPolling]);

  const triggerPoll = useCallback(() => {
    if (sessionId && !intervalRef.current) {
      startPolling(sessionId);
    }
  }, [sessionId, startPolling]);

  const waitForPurchase = useCallback((indices: number[]) => {
    awaitedIndicesRef.current = indices;
    setAwaitingPurchase(true);
    if (sessionId && !intervalRef.current) {
      startPolling(sessionId);
    }
  }, [sessionId, startPolling]);

  const isImagePurchased = useCallback(
    (index: number) => purchasedIndices.includes(index),
    [purchasedIndices]
  );

  return {
    status,
    imageUrls,
    purchasedIndices,
    awaitingPurchase,
    generatingMore,
    error,
    isPolling,
    triggerPoll,
    waitForPurchase,
    isImagePurchased,
  };
}
