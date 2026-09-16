"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Mede o artigo, não a página: incluir o bloco de recomendação e o rodapé faria
 * a barra nunca chegar ao fim quando o leitor termina o texto.
 *
 * Escreve direto no elemento — com `useState` isto re-renderizaria o artigo
 * inteiro a cada quadro de scroll.
 */
export default function ReadingProgressBar({
  targetRef,
}: {
  targetRef: RefObject<HTMLElement | null>;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const bar = barRef.current;
      const target = targetRef.current;
      if (!bar || !target) return;

      const rect = target.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress =
        scrollable > 0
          ? Math.min(1, Math.max(0, -rect.top / scrollable))
          : rect.bottom <= window.innerHeight
            ? 1
            : 0;

      bar.style.transform = `scaleX(${progress})`;
    }

    function schedule() {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [targetRef]);

  return (
    <div
      ref={barRef}
      aria-hidden
      style={{ transform: "scaleX(0)" }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-rose-500 transition-transform duration-150 motion-reduce:transition-none"
    />
  );
}
