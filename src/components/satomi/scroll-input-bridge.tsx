"use client";

import { useEffect } from "react";

function canScrollVertically(element: Element, deltaY: number) {
  const style = window.getComputedStyle(element);
  const allowsScroll = style.overflowY === "auto" || style.overflowY === "scroll";

  if (!allowsScroll || element.scrollHeight <= element.clientHeight + 1) {
    return false;
  }

  if (deltaY > 0) {
    return element.scrollTop + element.clientHeight < element.scrollHeight - 1;
  }

  return element.scrollTop > 1;
}

function findScrollableAncestor(target: EventTarget | null, deltaY: number) {
  if (!(target instanceof Element)) return null;

  let element: Element | null = target;

  while (element && element !== document.body && element !== document.documentElement) {
    if (canScrollVertically(element, deltaY)) return element;
    element = element.parentElement;
  }

  return null;
}

function normalizeWheelDelta(event: WheelEvent) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return event.deltaY * 16;
  }

  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * window.innerHeight;
  }

  return event.deltaY;
}

export function ScrollInputBridge() {
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.deltaY === 0) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const target = event.target;

      if (
        target instanceof Element &&
        target.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }

      const normalizedDeltaY = normalizeWheelDelta(event);

      if (findScrollableAncestor(target, normalizedDeltaY)) return;

      const documentElement = document.documentElement;
      const maxScroll = documentElement.scrollHeight - window.innerHeight;

      if (maxScroll <= 0) return;

      const currentScroll = window.scrollY;
      const nextScroll = Math.min(Math.max(currentScroll + normalizedDeltaY, 0), maxScroll);

      if (nextScroll === currentScroll) return;

      event.preventDefault();
      window.scrollTo({ top: nextScroll, behavior: "auto" });
    };

    window.addEventListener("wheel", handleWheel, { capture: true, passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
    };
  }, []);

  return null;
}
