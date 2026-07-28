"use client";

import { memo, useRef, type PointerEvent, type ReactNode } from "react";

interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number | string;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  colors?: string[];
}

const DEFAULT_COLORS = ["#c084fc", "#f472b6", "#38bdf8"];

function parseHSL(hslStr: string): { h: number; s: number; l: number } {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  };
}

function buildBoxShadow(glowColor: string, intensity: number): string {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true],
    [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false],
    [0, 0, 25, 2, 20, false],
  ];

  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const adjustedAlpha = Math.min(alpha * intensity, 100);
      return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${adjustedAlpha}%)`;
    })
    .join(",");
}

function BorderGlowComponent({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "40 80 80",
  backgroundColor,
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  colors = DEFAULT_COLORS,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  const updateGlow = () => {
    frameRef.current = null;

    const card = cardRef.current;
    const border = borderRef.current;
    const glow = glowRef.current;
    if (!card || !border || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = pointerRef.current.x - rect.left;
    const y = pointerRef.current.y - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const scaleX = dx === 0 ? Infinity : centerX / Math.abs(dx);
    const scaleY = dy === 0 ? Infinity : centerY / Math.abs(dy);
    const edgeProximity = Math.min(
      Math.max(1 / Math.min(scaleX, scaleY), 0),
      1
    );
    const cursorAngle =
      dx === 0 && dy === 0
        ? 0
        : ((Math.atan2(dy, dx) * 180) / Math.PI + 90 + 360) % 360;
    const colorSensitivity = edgeSensitivity + 20;
    const borderOpacity = Math.max(
      0,
      (edgeProximity * 100 - colorSensitivity) / (100 - colorSensitivity)
    );
    const glowOpacity = Math.max(
      0,
      (edgeProximity * 100 - edgeSensitivity) / (100 - edgeSensitivity)
    );
    const angle = `${cursorAngle.toFixed(3)}deg`;

    border.style.background = `conic-gradient(
      from ${angle} at center,
      ${colors[2]} 0%,
      ${colors[0]} ${coneSpread / 2}%,
      ${colors[1]} ${coneSpread}%,
      transparent ${coneSpread + 15}%,
      transparent ${100 - coneSpread - 15}%,
      ${colors[1]} ${100 - coneSpread}%,
      ${colors[0]} ${100 - coneSpread / 2}%,
      ${colors[2]} 100%
    )`;
    border.style.opacity = String(borderOpacity);
    glow.style.opacity = String(glowOpacity);
    const mask = `conic-gradient(from ${angle} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`;
    glow.style.maskImage = mask;
    glow.style.webkitMaskImage = mask;
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    pointerRef.current = { x: event.clientX, y: event.clientY };
    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(updateGlow);
    }
  };

  const handlePointerLeave = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    if (borderRef.current) borderRef.current.style.opacity = "0";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative grid isolate border border-white/15 ${className}`}
      style={{
        ...(backgroundColor ? { background: backgroundColor } : {}),
        borderRadius:
          typeof borderRadius === "number"
            ? `${borderRadius}px`
            : borderRadius,
        transform: "translate3d(0, 0, 0.01px)",
      }}
    >
      <div
        ref={borderRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] rounded-[inherit] p-px opacity-0 transition-opacity duration-200"
        style={
          {
            maskImage:
              "linear-gradient(#000 0 0), linear-gradient(#000 0 0)",
            maskClip: "content-box, border-box",
            maskComposite: "exclude",
            WebkitMaskImage:
              "linear-gradient(#000 0 0), linear-gradient(#000 0 0)",
            WebkitMaskClip: "content-box, border-box",
            WebkitMaskComposite: "xor",
          } as React.CSSProperties
        }
      />

      <span
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute z-[2] rounded-[inherit] opacity-0 transition-opacity duration-200"
        style={{
          inset: `${-glowRadius}px`,
          mixBlendMode: "plus-lighter",
        }}
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${glowRadius}px`,
            boxShadow: buildBoxShadow(glowColor, glowIntensity),
          }}
        />
      </span>

      <div className="relative z-[1] flex flex-col overflow-auto">
        {children}
      </div>
    </div>
  );
}

const BorderGlow = memo(BorderGlowComponent);
export default BorderGlow;
