declare global {
  interface Navigator {
    standalone?: boolean;
  }

  interface Window {
    Capacitor?: {
      isNativePlatform?: () => boolean;
      getPlatform?: () => string;
      platform?: string;
    };
  }
}

export function isClient() {
  return typeof window !== "undefined";
}

export function isCapacitorApp() {
  if (!isClient()) return false;

  const capacitor = window.Capacitor;

  if (!capacitor) return false;

  if (typeof capacitor.isNativePlatform === "function") {
    return capacitor.isNativePlatform();
  }

  const platform = capacitor.getPlatform?.() ?? capacitor.platform;
  return Boolean(platform && platform !== "web");
}

export function isStandalonePWA() {
  if (!isClient()) return false;

  const mediaQuery = window.matchMedia?.("(display-mode: standalone)");
  const isIosStandalone = "standalone" in window.navigator
    && window.navigator.standalone === true;

  return Boolean(mediaQuery?.matches || isIosStandalone);
}

export function isMobileBrowser() {
  if (!isClient()) return false;
  if (isCapacitorApp()) return false;

  const userAgent = window.navigator.userAgent || "";
  return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
}
