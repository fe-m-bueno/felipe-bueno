"use client";

import { memo, useEffect, useState } from "react";
import RdevLiquidGlass from "liquid-glass-react";

type LiquidGlassVariant = "badge" | "card" | "default";

interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  variant?: LiquidGlassVariant;
}

const variantClasses = {
  badge: "liquid-glass-badge",
  card: "liquid-glass-card",
  default: "liquid-glass",
} as const;

const glassSettings = {
  badge: {
    displacementScale: 34,
    blurAmount: 0.1,
    saturation: 145,
    aberrationIntensity: 1.2,
    elasticity: 0.18,
    cornerRadius: 999,
    padding: "0",
    mode: "standard" as const,
  },
  card: {
    displacementScale: 48,
    blurAmount: 0.18,
    saturation: 155,
    aberrationIntensity: 1.6,
    elasticity: 0.1,
    cornerRadius: 28,
    padding: "0",
    mode: "prominent" as const,
  },
  default: {
    displacementScale: 42,
    blurAmount: 0.14,
    saturation: 150,
    aberrationIntensity: 1.4,
    elasticity: 0.12,
    cornerRadius: 24,
    padding: "0",
    mode: "standard" as const,
  },
};

function getInitialReducedMotion() {
  return typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(getInitialReducedMotion);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return reducedMotion;
}

function LiquidGlassComponent({
  children,
  className = "",
  variant = "default",
}: LiquidGlassProps) {
  const reducedMotion = useReducedMotion();
  const classes = `${variantClasses[variant]} ${className}`;

  return (
    <div className={classes}>
      {!reducedMotion && (
        <div className="liquid-glass-rdev-layer" aria-hidden="true">
          <RdevLiquidGlass
            {...glassSettings[variant]}
            className="liquid-glass-rdev-overlay"
            overLight={false}
          >
            <span className="liquid-glass-rdev-fill" />
          </RdevLiquidGlass>
        </div>
      )}
      <div className="liquid-glass-content">{children}</div>
    </div>
  );
}

const LiquidGlass = memo(LiquidGlassComponent);
export default LiquidGlass;
