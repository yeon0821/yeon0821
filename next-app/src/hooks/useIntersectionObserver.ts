import { RefObject, useState, useEffect } from "react";

function useIntersectionObserver(
  elementRef: RefObject<Element | null>,
  {
    threshold = 0.1,
    root = null,
    rootMargin = "0%",
  }: IntersectionObserverInit = {}
) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const node = elementRef.current;

    if (!node) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setEntry(entry),
      { threshold, root, rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin]);

  return entry;
}

export default useIntersectionObserver;
