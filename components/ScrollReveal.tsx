'use client';
import { useRef, useEffect, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasObserved = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const currentRef = ref.current;
    if (!currentRef || hasObserved.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const reveal = () => {
            setIsVisible(true);
            hasObserved.current = true;
            observer.disconnect();
          };

          if (delay > 0) {
            setTimeout(reveal, delay);
          } else if ('requestIdleCallback' in window) {
            (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback(reveal, { timeout: 100 });
          } else {
            reveal();
          }
        }
      },
      {
        threshold: 0.05,
        rootMargin: '50px 0px',
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`scroll-reveal w-full ${isVisible ? 'scroll-reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

