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

    // No position reset on leave — CSS :hover opacity transition fades the
    // highlight at the last cursor position, avoiding a visible snap to center.
    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
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
