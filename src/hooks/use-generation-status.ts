"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SessionStatus } from "@/types";

interface GenerationStatus {
  status: SessionStatus | null;
  imageUrls: string[];
  purchased: boolean;
  awaitingPurchase: boolean;
  generatingMore: boolean;
  error: string | null;
  isPolling: boolean;
  triggerPoll: () => void;
  waitForPurchase: () => void;
}

export function useGenerationStatus(sessionId: string | null): GenerationStatus {
  const [status, setStatus] = useState<SessionStatus | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [purchased, setPurchased] = useState(false);
  const [awaitingPurchase, setAwaitingPurchase] = useState(false);
  const [generatingMore, setGeneratingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const awaitingPurchaseRef = useRef(false);

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
        setPurchased(data.purchased ?? false);
        setGeneratingMore(data.generatingMore ?? false);

        if (data.purchased) {
          awaitingPurchaseRef.current = false;
          setAwaitingPurchase(false);
        }

        // Keep polling if awaiting purchase confirmation
        if (awaitingPurchaseRef.current && !data.purchased) {
          return; // don't stop polling
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

  // Start polling when sessionId changes (initial generation)
  useEffect(() => {
    stopPolling();

    if (!sessionId) {
      // Reset all state so stale values don't cause issues on next generation
      setStatus(null);
      setError(null);
      setImageUrls([]);
      setPurchased(false);
      setAwaitingPurchase(false);
      awaitingPurchaseRef.current = false;
      setGeneratingMore(false);
      return;
    }

    setStatus("analyzing");
    setError(null);
    setImageUrls([]);
    setPurchased(false);
    setAwaitingPurchase(false);
    awaitingPurchaseRef.current = false;
    setGeneratingMore(false);
    startPolling(sessionId);

    return () => stopPolling();
  }, [sessionId, stopPolling, startPolling]);

  const triggerPoll = useCallback(() => {
    if (sessionId && !intervalRef.current) {
      startPolling(sessionId);
    }
  }, [sessionId, startPolling]);

  const waitForPurchase = useCallback(() => {
    awaitingPurchaseRef.current = true;
    setAwaitingPurchase(true);
    if (sessionId && !intervalRef.current) {
      startPolling(sessionId);
    }
  }, [sessionId, startPolling]);

  return { status, imageUrls, purchased, awaitingPurchase, generatingMore, error, isPolling, triggerPoll, waitForPurchase };
}
