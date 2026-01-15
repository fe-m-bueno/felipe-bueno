"use client";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef, useMemo, memo, useCallback } from "react";
import { EyeClosed, ArrowRight, Eye, Download } from "lucide-react";
import Badge from "@/components/Badge";
import OpenToWorkBadge from "@/components/OpenToWorkBadge";

const skills = [
  { name: "TypeScript", icon: "bxl:typescript" },
  { name: "JavaScript", icon: "ri:javascript-fill" },
  { name: "Python", icon: "mdi:language-python" },
  { name: "React", icon: "mdi:react" },
  { name: "Next.js", icon: "ri:nextjs-fill" },
  { name: "Node.js", icon: "mdi:nodejs" },
  { name: "Vue.js", icon: "mdi:vuejs" },
  { name: "PostgreSQL", icon: "mdi:database-outline" },
  { name: "Docker", icon: "mdi:docker" },
  { name: "Tailwind CSS", icon: "mdi:tailwind" },
  { name: "Django", icon: "simple-icons:django" },
  { name: "Angular", icon: "mdi:angular" },
  { name: "Apache Airflow", icon: "simple-icons:apacheairflow" },
  { name: "LangGraph", icon: "mdi:graph" },
  { name: "GraphQL", icon: "mdi:graphql" },
  { name: "React Native", icon: "mdi:react" },
  { name: "Nuxt.js", icon: "lineicons:nuxt" },
  { name: "Svelte", icon: "ri:svelte-fill" },
  { name: "Apollo Studio", icon: "file-icons:apollo" },
  { name: "Swift", icon: "lineicons:swift" },
  { name: "Drizzle", icon: "lineicons:drizzle" },
  { name: "Prisma", icon: "lineicons:prisma" },
  { name: "Figma", icon: "solar:figma-bold" },
  { name: "HTML", icon: "flowbite:html-solid" },
  { name: "CSS", icon: "flowbite:css-solid" },
];

// Memoized skills list - Badge já é memoizado internamente
const SkillsList = memo(function SkillsList() {
  return (
    <>
      {skills.map((skill) => (
        <Badge key={skill.name} name={skill.name} icon={skill.icon} />
      ))}
    </>
  );
});

// Easing function for smooth interpolation
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

// Linear interpolation helper
const lerp = (current: number, target: number, factor: number): number =>
  current + (target - current) * factor;

// Separate component for the 3D image effect - isolated re-renders
const HeroImage = memo(function HeroImage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Animation state
  const currentRotation = useRef({ x: 0, y: 0 });
  const currentGlow = useRef({ x: 50, y: 50, intensity: 0.08 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const isAnimating = useRef(false);

  const toggleFilter = useCallback(() => setFilter((f) => !f), []);

  // Smooth animation loop
  const animate = useCallback(() => {
    const container = containerRef.current;
    const glow = glowRef.current;
    if (!container) return;

    const current = currentRotation.current;
    const target = targetRotation.current;

    // Smooth interpolation
    const rotationLerp = 0.06;
    const lightLerp = 0.08;

    current.x = lerp(current.x, target.x, rotationLerp);
    current.y = lerp(current.y, target.y, rotationLerp);

    // Apply 3D transform
    container.style.transform = `perspective(1000px) rotateX(${current.x}deg) rotateY(${current.y}deg)`;

    // Calculate intensity based on rotation
    const rotationMagnitude = Math.sqrt(
      current.x * current.x + current.y * current.y
    );
    const targetIntensity = 0.08 + Math.min(rotationMagnitude / 15, 0.25);

    // Update glow effect
    if (glow) {
      const targetGlowX = 50 + current.y * 3;
      const targetGlowY = 50 - current.x * 3;

      currentGlow.current.x = lerp(
        currentGlow.current.x,
        targetGlowX,
        lightLerp
      );
      currentGlow.current.y = lerp(
        currentGlow.current.y,
        targetGlowY,
        lightLerp
      );
      currentGlow.current.intensity = lerp(
        currentGlow.current.intensity,
        targetIntensity,
        lightLerp
      );

      glow.style.background = `radial-gradient(ellipse at ${currentGlow.current.x}% ${currentGlow.current.y}%, rgba(255,255,255,${currentGlow.current.intensity}) 0%, transparent 60%)`;
    }

    // Continue animation
    const threshold = 0.01;
    if (
      Math.abs(target.x - current.x) > threshold ||
      Math.abs(target.y - current.y) > threshold
    ) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      isAnimating.current = false;
    }
  }, []);

  const startAnimation = useCallback(() => {
    if (!isAnimating.current) {
      isAnimating.current = true;
      animate();
    }
  }, [animate]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    let effectiveRange = 500;
    let maxRotation = 10;

    const getSettings = () => {
      const vw = window.innerWidth;
      effectiveRange = vw < 768 ? 200 : vw < 1024 ? 350 : 500;
      maxRotation = vw < 768 ? 6 : 10;
    };
    getSettings();

    const processMove = (clientX: number, clientY: number) => {
      // Always get fresh rect to handle scroll
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > effectiveRange) {
        targetRotation.current = { x: 0, y: 0 };
      } else {
        const falloff = easeOutCubic(1 - distance / effectiveRange);
        const normalizedX = deltaX / (rect.width / 2);
        const normalizedY = deltaY / (rect.height / 2);

        targetRotation.current = {
          x:
            Math.max(
              -maxRotation,
              Math.min(maxRotation, -normalizedY * maxRotation)
            ) * falloff,
          y:
            Math.max(
              -maxRotation,
              Math.min(maxRotation, normalizedX * maxRotation)
            ) * falloff,
        };
      }
      startAnimation();
    };

    const handleMouseMove = (event: MouseEvent) => {
      processMove(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        processMove(touch.clientX, touch.clientY);
      }
    };

    const handleLeave = () => {
      targetRotation.current = { x: 0, y: 0 };
      startAnimation();
    };

    const handleResize = () => {
      getSettings();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    container.addEventListener("mouseleave", handleLeave);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mouseleave", handleLeave);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion, startAnimation]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center mt-8 lg:mt-0 will-change-transform"
      style={{
        transformStyle: "preserve-3d",
        isolation: "isolate",
        zIndex: 1,
      }}
    >
      <div
        className="relative rounded-3xl p-px h-1/2 w-1/2 lg:h-full overflow-hidden bg-gradient-to-b from-rose-400 to-rose-400/10 shadow-2xl shadow-rose-500/20 dark:shadow-rose-400/10"
        onClick={toggleFilter}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Dynamic light reflection */}
        <div
          ref={glowRef}
          className="absolute inset-0 z-30 pointer-events-none rounded-3xl"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)",
            mixBlendMode: "overlay",
          }}
        />

        {/* Static glass highlight at top */}
        <div
          className="absolute inset-x-0 top-0 h-1/3 z-20 pointer-events-none rounded-t-3xl"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)",
            mixBlendMode: "overlay",
          }}
        />

        {filter && (
          <p className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-base z-40 text-white font-semibold px-8 lg:px-0 drop-shadow-lg">
            <span className="inline-flex items-center gap-2">
              <EyeClosed className="w-6 h-6" /> {t("hero.clickToRemoveBlur")}
            </span>
          </p>
        )}

        <div className="relative p-[2px] rounded-[calc(1.25rem-1px)]">
          <div
            className={`absolute inset-0 p-px rounded-3xl transition-all duration-500 ease-out z-[35] ${
              filter
                ? "backdrop-blur-xl backdrop-brightness-75 dark:backdrop-brightness-50"
                : ""
            }`}
          />
          <Image
            src="/hero.jpg"
            alt="Felipe Bueno - Frontend Developer"
            width={500}
            height={500}
            className="rounded-3xl"
            priority
            placeholder="empty"
          />
        </div>

        {/* Border shine */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
            mixBlendMode: "overlay",
          }}
        />
      </div>
    </div>
  );
});

export default function Hero() {
  const { t, i18n } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const locale = (i18n.language.split("-")[0] as "en" | "pt") || "en";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants for better performance
  const fadeInVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    }),
    []
  );

  // Disable animations if user prefers reduced motion
  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: "hidden",
        animate: mounted ? "visible" : "hidden",
        variants: fadeInVariants,
        transition: { duration: 0.6 },
      };

  const delayedAnimationProps = prefersReducedMotion
    ? {}
    : {
        initial: "hidden",
        animate: mounted ? "visible" : "hidden",
        variants: fadeInVariants,
        transition: { duration: 0.6, delay: 0.3 },
      };

  const ctaAnimationProps = prefersReducedMotion
    ? {}
    : {
        initial: "hidden",
        animate: mounted ? "visible" : "hidden",
        variants: fadeInVariants,
        transition: { duration: 0.6, delay: 0.5 },
      };

  return (
    <section
      id="landing"
      className="relative grid grid-cols-1 lg:grid-cols-2 items-center justify-center text-center px-4 w-full pt-28 lg:pt-20 max-w-8xl mx-auto isolation-auto"
    >
      <div className="flex flex-col justify-center items-center lg:h-screen gap-8 lg:gap-12">
        <div className="flex flex-col justify-center items-center lg:items-start lg:ml-16 mx-auto sm:pl-0 lg:pl-12">
          <motion.div className="mb-6" {...animationProps}>
            <OpenToWorkBadge />
          </motion.div>
          <motion.h1 className="~text-3xl/7xl mb-8" {...animationProps}>
            <span className="font-bold inline-block text-nowrap">
              {t("hero.title")}
              <span
                className="inline-block ml-2 animate-wave"
                aria-hidden="true"
              >
                👋
              </span>
            </span>
          </motion.h1>
          <motion.p
            className="~text-base/2xl mb-6 text-center lg:text-start"
            {...animationProps}
          >
            {t("hero.description")}
          </motion.p>
          <motion.p
            className="~text-base/2xl mb-8 text-center lg:text-start font-semibold"
            {...delayedAnimationProps}
          >
            {t("hero.description2")}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 justify-center lg:justify-start items-center w-full"
            {...ctaAnimationProps}
          >
            {/* CTA Primário - Gradiente com glow */}
            <Link
              href="#contact"
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 overflow-hidden
                bg-gradient-to-r from-rose-500 via-rose-600 to-rose-500 bg-[length:200%_100%] hover:bg-[position:100%_0]
                text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)]
                border border-rose-400/30 hover:border-rose-400/50
                hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">{t("cta.workTogether")}</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform duration-300" />
              {/* Shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            </Link>

            {/* CTA Secundário - Glass effect */}
            <Link
              href="#projects"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300
                bg-white/10 dark:bg-white/5 backdrop-blur-md
                border border-black/10 dark:border-white/10 hover:border-rose-500/50 dark:hover:border-rose-400/50
                hover:bg-rose-500/10 dark:hover:bg-rose-500/10
                shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(244,63,94,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]
                hover:scale-[1.02] active:scale-[0.98]"
            >
              {t("cta.viewWork")}
              <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            </Link>

            {/* CTA Terciário - Glass effect */}
            <Link
              href={
                locale === "pt"
                  ? "/pdfs/resume_2026_pt.pdf"
                  : "/pdfs/resume_2026_en.pdf"
              }
              target="_blank"
              download
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300
                bg-white/10 dark:bg-white/5 backdrop-blur-md
                border border-black/10 dark:border-white/10 hover:border-rose-500/50 dark:hover:border-rose-400/50
                hover:bg-rose-500/10 dark:hover:bg-rose-500/10
                shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(244,63,94,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]
                hover:scale-[1.02] active:scale-[0.98]"
            >
              {t("cta.downloadResume")}
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
        <div className="flex flex-wrap justify-center items-center lg:justify-start lg:items-start gap-2 lg:ml-16 h-fit mx-auto sm:pl-0 lg:pl-12">
          <SkillsList />
        </div>
      </div>

      <HeroImage />
    </section>
  );
}
