"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "./client";
import { fetchFinanceSnapshot, type FinanceSnapshot } from "./finance";

export function useFinanceSnapshot() {
  const [snapshot, setSnapshot] = useState<FinanceSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const nextSnapshot = await fetchFinanceSnapshot(supabase);
      setSnapshot(nextSnapshot);
      return nextSnapshot;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Data keuangan belum bisa dimuat saat ini.";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadInitialSnapshot() {
      try {
        const supabase = createSupabaseBrowserClient();
        const nextSnapshot = await fetchFinanceSnapshot(supabase);

        if (!isActive) return;
        setSnapshot(nextSnapshot);
        setError(null);
      } catch (error) {
        if (!isActive) return;

        const message =
          error instanceof Error
            ? error.message
            : "Data keuangan belum bisa dimuat saat ini.";
        setError(message);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialSnapshot();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    snapshot,
    isLoading,
    error,
    refresh,
  };
}
