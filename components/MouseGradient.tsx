"use client";

import useMousePosition from "@/components/utils/mouse-position";
import { useState, useEffect } from "react";

export default function MouseGradient() {
  const { x, y } = useMousePosition();
  const [gradientStyle, setGradientStyle] = useState({});

  useEffect(() => {
    setGradientStyle({
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(255, 105, 180, 0.3) 40px, transparent 140px)`,
    });
  }, [x, y]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-1] transition-opacity duration-200 lg:opacity-100 opacity-0"
      style={gradientStyle}
    ></div>
  );
}
