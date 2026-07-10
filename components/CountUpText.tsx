"use client";
import { useEffect, useRef, useState } from "react";

type Segment =
  | { type: "text"; raw: string }
  | { type: "number"; raw: string; target: number; decimals: number; separator: string };

// Parses numeric tokens out of a CMS-provided string so the numbers can be
// animated without hardcoding content (works for "92s → 3.6s" and pt "3,6s").
function parseSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  const re = /\d+(?:[.,]\d+)?/g;
  let last = 0;

  for (const match of text.matchAll(re)) {
    const index = match.index ?? 0;
    if (index > last) {
      segments.push({ type: "text", raw: text.slice(last, index) });
    }
    const raw = match[0];
    const separatorMatch = raw.match(/[.,]/);
    const separator = separatorMatch ? separatorMatch[0] : ".";
    const decimals = separatorMatch ? raw.length - raw.indexOf(separator) - 1 : 0;
    segments.push({
      type: "number",
      raw,
      target: parseFloat(raw.replace(",", ".")),
      decimals,
      separator,
    });
    last = index + raw.length;
  }

  if (last < text.length) {
    segments.push({ type: "text", raw: text.slice(last) });
  }

  return segments;
}

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export default function CountUpText({
  text,
  duration = 1400,
  className,
}: {
  text: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    hasStarted.current = false;

    const element = ref.current;
    if (!element) return;

    let rafId: number | null = null;

    const start = () => {
      if (hasStarted.current) return;
      hasStarted.current = true;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setProgress(1);
        return;
      }

      const startTime = performance.now();
      const tick = (now: number) => {
        const elapsed = Math.min((now - startTime) / duration, 1);
        setProgress(easeOutCubic(elapsed));
        if (elapsed < 1) {
          rafId = requestAnimationFrame(tick);
        }
      };
      rafId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [text, duration]);

  const segments = parseSegments(text);

  return (
    <span ref={ref} className={className}>
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return <span key={index}>{segment.raw}</span>;
        }
        const value = segment.target * progress;
        const formatted = value
          .toFixed(segment.decimals)
          .replace(".", segment.separator);
        return (
          <span key={index} className="tabular-nums">
            {formatted}
          </span>
        );
      })}
    </span>
  );
}
