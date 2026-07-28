"use client";
import { memo } from "react";
import BorderGlow from "@/components/BorderGlow";

interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  variant?: "badge" | "card" | "default";
  glowBorderRadius?: number;
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
  glowBorderRadius,
}: LiquidGlassProps) {
  if (variant === "badge") {
    return (
      <div className={`${variantClasses.badge} ${className}`}>
        {children}
      </div>
    );
  }

  const borderRadius =
    glowBorderRadius ?? 24;

  return (
    <BorderGlow
      className={`${variantClasses[variant]} ${className}`}
      borderRadius={borderRadius}
      backgroundColor="var(--border-glow-surface)"
      edgeSensitivity={18}
      glowColor="350 89 60"
      glowRadius={22}
      glowIntensity={0.5}
      coneSpread={19}
      colors={["#fb7185", "#f43f5e", "#e11d48"]}
    >
      {children}
    </BorderGlow>
  );
}

const LiquidGlass = memo(LiquidGlassComponent);
export default LiquidGlass;
