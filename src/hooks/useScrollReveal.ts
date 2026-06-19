import { useEffect, useState, useRef } from 'react';

/**
 * A custom hook that returns a ref and a visibility state.
 * Triggers when the element intersects the viewport.
 * 
 * @param threshold Fraction of the element that needs to be visible (0.0 to 1.0)
 * @param triggerOnce Whether to animate only once
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.1,
  triggerOnce = true
) {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsRevealed(false);
        }
      },
      {
        threshold,
        // Trigger slightly before it fully comes in for smoother feel
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, triggerOnce]);

  return [ref, isRevealed] as const;
}
