"use client";

import { useEffect } from "react";
import { isCapacitorApp, isClient } from "@/src/lib/platform";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!isClient() || isCapacitorApp() || !("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(
            registrations
              .filter((registration) => new URL(registration.scope).origin === location.origin)
              .map((registration) => registration.unregister()),
          ),
        )
        .catch(() => undefined);
      return;
    }

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch {
        // Browser/PWA registration should never block the finance UI.
      }
    };

    register();
  }, []);

  return null;
}
