"use client";
import { useRef, useEffect, useCallback, useState, memo } from "react";
import { useReducedMotion } from "motion/react";

interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  variant?: "badge" | "card" | "default";
}

function LiquidGlassComponent({
  children,
  className = "",
  variant = "default",
}: LiquidGlassProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (prefersReducedMotion || !containerRef.current) return;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        container.style.setProperty("--mouse-x", `${x}%`);
        container.style.setProperty("--mouse-y", `${y}%`);
      });
    },
    [prefersReducedMotion]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (containerRef.current) {
      containerRef.current.style.setProperty("--mouse-x", "50%");
      containerRef.current.style.setProperty("--mouse-y", "50%");
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    prefersReducedMotion,
  ]);

  const variantClasses = {
    badge: "liquid-glass-badge",
    card: "liquid-glass-card",
    default: "liquid-glass",
  };

  const baseClass = variantClasses[variant];
  const hoveredClass = isHovered ? "liquid-glass-active" : "";

  return (
    <div
      ref={containerRef}
      className={`${baseClass} ${hoveredClass} ${className}`}
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
