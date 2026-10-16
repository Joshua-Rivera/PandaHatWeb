import { useSyncExternalStore } from "react";

function mediaStore(media: string) {
  const query = window.matchMedia(media);
  const subscribers = new Set<() => void>();
  query.addEventListener("change", () => subscribers.forEach(notify => notify()));
  return {
    subscribe: (notify: () => void) => {
      subscribers.add(notify);
      return () => { subscribers.delete(notify); };
    },
    snapshot: () => query.matches,
  };
}
const mobile = mediaStore("(max-width: 767px)");
const reduced = mediaStore("(prefers-reduced-motion: reduce)");
export const useMobile = () => useSyncExternalStore(mobile.subscribe, mobile.snapshot, () => false);
export const useMobileReducedMotion = () => useSyncExternalStore(reduced.subscribe, reduced.snapshot, () => false);
