"use client";

import { useEffect, useRef, memo } from "react";

function MouseGradientComponent() {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gradient = gradientRef.current;
    if (!gradient) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let frameRequested = false;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const updateGradient = () => {
      frameRequested = false;
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;

      gradient.style.setProperty("--mouse-x", `${currentX}px`);
      gradient.style.setProperty("--mouse-y", `${currentY}px`);

      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        frameRequested = true;
        requestAnimationFrame(updateGradient);
      }
    };

    const requestUpdate = () => {
      if (!frameRequested) {
        frameRequested = true;
        requestAnimationFrame(updateGradient);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      currentX = targetX;
      currentY = targetY;
      gradient.style.opacity = "1";
      gradient.style.setProperty("--mouse-x", `${currentX}px`);
      gradient.style.setProperty("--mouse-y", `${currentY}px`);
      requestUpdate();
    };

    const handlePointerLeave = () => {
      gradient.style.opacity = "0";
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={gradientRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 opacity-0 mouse-gradient"
      style={
        {
          "--mouse-x": "50vw",
          "--mouse-y": "50vh",
          opacity: 0,
        } as React.CSSProperties
      }
    >
      <span className="mouse-gradient__core" />
      <span className="mouse-gradient__halo" />
    </div>
  );
}

const MouseGradient = memo(MouseGradientComponent);
export default MouseGradient;
