"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";

const SECTIONS = ["landing", "about", "projects", "contact"];

// Throttle helper para limitar execuções
function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): T {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return ((...args: unknown[]) => {
    const now = Date.now();
    const remaining = delay - (now - lastCall);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      fn(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn(...args);
      }, remaining);
    }
  }) as T;
}

export default function ScrollNavigator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  // Cache de posições das seções para evitar recálculos
  const sectionPositionsRef = useRef<{ top: number; bottom: number }[]>([]);
  const lastUpdateRef = useRef(0);

  // Atualiza cache de posições das seções (apenas no resize ou quando necessário)
  const updateSectionPositions = useCallback(() => {
    sectionPositionsRef.current = SECTIONS.map((id) => {
      const section = document.getElementById(id);
      if (section) {
        return {
          top: section.offsetTop,
          bottom: section.offsetTop + section.offsetHeight,
        };
      }
      return { top: 0, bottom: 0 };
    });
  }, []);

  const updateScrollState = useCallback(() => {
    const now = Date.now();
    // Evita atualizações muito frequentes (mínimo 16ms = ~60fps)
    if (now - lastUpdateRef.current < 16) return;
    lastUpdateRef.current = now;

    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;

    // Só atualiza se mudou significativamente (evita re-renders desnecessários)
    setScrollProgress((prev) =>
      Math.abs(prev - progress) > 0.5 ? progress : prev
    );

    // Detectar seção atual usando cache
    const viewportCenter = scrollTop + window.innerHeight / 2;
    let detectedSection = 0;
    const positions = sectionPositionsRef.current;

    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      if (viewportCenter >= pos.top && viewportCenter < pos.bottom) {
        detectedSection = i;
        break;
      }
    }

    // Se estamos além da última seção
    const lastPos = positions[positions.length - 1];
    if (lastPos && viewportCenter >= lastPos.top) {
      detectedSection = SECTIONS.length - 1;
    }

    // Só atualiza se mudou
    setCurrentSection((prev) =>
      prev !== detectedSection ? detectedSection : prev
    );
    setIsAtBottom((prev) => {
      const newValue = detectedSection === SECTIONS.length - 1;
      return prev !== newValue ? newValue : prev;
    });
  }, []);

  useEffect(() => {
    // Atualiza posições iniciais
    updateSectionPositions();
    updateScrollState();

    // Throttle de 50ms para scroll (20 updates/segundo é suficiente)
    const throttledScrollHandler = throttle(updateScrollState, 50);

    // Debounce para resize (só atualiza posições quando termina de redimensionar)
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateSectionPositions();
        updateScrollState();
      }, 150);
    };

    window.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [updateScrollState, updateSectionPositions]);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);

    if (isAtBottom) {
      // Voltar ao topo
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // Ir para a próxima seção
      const nextSection = Math.min(currentSection + 1, SECTIONS.length - 1);
      const targetElement = document.getElementById(SECTIONS[nextSection]);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  const circumference = 2 * Math.PI * 22;
  const strokeDashoffset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      onClick={handleClick}
      className={`
        scroll-navigator
        fixed bottom-6 right-6 z-[9999]
        w-14 h-14
        flex items-center justify-center
        rounded-full
        bg-white/80 dark:bg-black/60
        backdrop-blur-xl
        border border-gray-200/30 dark:border-gray-700/30
        shadow-lg shadow-rose-500/10
        cursor-pointer
        transition-all duration-300 ease-out
        hover:scale-110 hover:shadow-xl hover:shadow-rose-500/20
        active:scale-95
        ${isClicked ? "scroll-navigator-clicked" : ""}
      `}
      aria-label={isAtBottom ? "Voltar ao topo" : "Ir para próxima seção"}
    >
      {/* Círculo de progresso SVG */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 56 56"
      >
        {/* Círculo de fundo */}
        <circle
          cx="28"
          cy="28"
          r="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-gray-200/50 dark:text-gray-700/50"
        />
        {/* Círculo de progresso rosa */}
        <circle
          cx="28"
          cy="28"
          r="22"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-150 ease-out"
        />
        {/* Gradiente rosa */}
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
      </svg>

      {/* Ícone da flecha */}
      <div
        className="relative z-10 transition-transform duration-500 ease-out"
        style={{
          transform: isAtBottom ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        <ChevronDown className="w-6 h-6 text-rose-500" strokeWidth={2.5} />
      </div>
    </button>
  );
}
