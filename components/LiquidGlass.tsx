"use client";
import { useRef, useEffect, memo } from "react";

interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  variant?: "badge" | "card" | "default";
}

const variantClasses = {
  badge: "liquid-glass-badge",
  card: "liquid-glass-card",
  default: "liquid-glass",
} as const;

function LiquidGlassComponent({
  children,
  className = "",
  variant = "default",
}: LiquidGlassProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Checa preferência de movimento reduzido via CSS
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let frameRequested = false;
    let lastX = 0;
    let lastY = 0;

    const updatePosition = () => {
      frameRequested = false;
      container.style.setProperty("--mouse-x", `${lastX}%`);
      container.style.setProperty("--mouse-y", `${lastY}%`);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      lastX = ((event.clientX - rect.left) / rect.width) * 100;
      lastY = ((event.clientY - rect.top) / rect.height) * 100;

      if (!frameRequested) {
        frameRequested = true;
        requestAnimationFrame(updatePosition);
      }
    };

    const handleMouseLeave = () => {
      lastX = 50;
      lastY = 50;
      if (!frameRequested) {
        frameRequested = true;
        requestAnimationFrame(updatePosition);
      }
    };

    // Adiciona classe ativa via CSS :hover ao invés de React state
    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${variantClasses[variant]} ${className}`}
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

const LiquidGlass = memo(LiquidGlassComponent);
export default LiquidGlass;
