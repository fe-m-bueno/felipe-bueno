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

    if (prefersReducedMotion) {
      gradient.style.opacity = "0.55";
      return;
    }

    let frameRequested = false;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let isVisible = false;

    const render = () => {
      frameRequested = false;
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

      gradient.style.setProperty("--mouse-x", `${currentX}px`);
      gradient.style.setProperty("--mouse-y", `${currentY}px`);
      gradient.style.opacity = isVisible ? "1" : "0.62";

      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        frameRequested = true;
        requestAnimationFrame(render);
      }
    };

    const requestRender = () => {
      if (!frameRequested) {
        frameRequested = true;
        requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (event: PointerEvent | MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      isVisible = true;
      gradient.style.opacity = "1";
      gradient.style.setProperty("--mouse-x", `${targetX}px`);
      gradient.style.setProperty("--mouse-y", `${targetY}px`);
    };

    const handlePointerLeave = () => {
      isVisible = false;
      gradient.style.opacity = "0";
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={gradientRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[-1] mouse-gradient"
      style={
        {
          "--mouse-x": "50vw",
          "--mouse-y": "50vh",
          opacity: 0,
        } as React.CSSProperties
      }
    >
      <span className="mouse-gradient__orb mouse-gradient__orb--primary" />
      <span className="mouse-gradient__orb mouse-gradient__orb--secondary" />
      <span className="mouse-gradient__veil" />
    </div>
  );
}

const MouseGradient = memo(MouseGradientComponent);
export default MouseGradient;
