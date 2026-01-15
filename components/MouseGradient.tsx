"use client";

import { useEffect, useRef, useCallback } from "react";

export default function MouseGradient() {
  const gradientRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (gradientRef.current) {
        // Use CSS custom properties for GPU-accelerated updates
        gradientRef.current.style.setProperty("--mouse-x", `${event.clientX}px`);
        gradientRef.current.style.setProperty("--mouse-y", `${event.clientY}px`);
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={gradientRef}
      className="fixed inset-0 pointer-events-none z-[-1] lg:opacity-100 opacity-0 mouse-gradient"
      style={{
        ["--mouse-x" as string]: "50%",
        ["--mouse-y" as string]: "50%",
      }}
    />
  );
}
