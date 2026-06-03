"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

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
        // PWA registration should never block the finance UI.
      }
    };

    register();
  }, []);

  return null;
}
