"use client";
import { useState, useEffect, useRef, useCallback } from "react";

interface MousePosition {
  x: number;
  y: number;
}

export default function useMousePosition(throttleMs = 16): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const now = performance.now();

      // Throttle updates
      if (now - lastUpdateRef.current < throttleMs) return;

      // Cancel any pending RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Schedule update on next animation frame
      rafRef.current = requestAnimationFrame(() => {
        lastUpdateRef.current = now;
        setMousePosition({ x: event.clientX, y: event.clientY });
      });
    },
    [throttleMs]
  );

  useEffect(() => {
    // Use passive listener for better scroll performance
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove]);

  return mousePosition;
}
