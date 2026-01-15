"use client";

import { useEffect, useRef, memo } from "react";

function MouseGradientComponent() {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gradient = gradientRef.current;
    if (!gradient) return;

    // Verifica preferência de movimento reduzido
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let frameRequested = false;
    let lastX = 0;
    let lastY = 0;

    const updateGradient = () => {
      frameRequested = false;
      gradient.style.setProperty("--mouse-x", `${lastX}px`);
      gradient.style.setProperty("--mouse-y", `${lastY}px`);
    };

    const handleMouseMove = (event: MouseEvent) => {
      lastX = event.clientX;
      lastY = event.clientY;

      // Coalescência de eventos usando RAF
      if (!frameRequested) {
        frameRequested = true;
        requestAnimationFrame(updateGradient);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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

const MouseGradient = memo(MouseGradientComponent);
export default MouseGradient;
