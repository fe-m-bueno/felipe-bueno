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

// Separate component for the 3D image effect - isolated re-renders
const HeroImage = memo(function HeroImage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const specularRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const fresnelRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Separate current values for smoother interpolation of each effect
  const currentRotation = useRef({ x: 0, y: 0 });
  const currentGlow = useRef({ x: 50, y: 50, intensity: 0 });
  const currentSpecular = useRef({ x: 50, y: 50, intensity: 0 });
  const currentShine = useRef({ angle: 90, offset: 50, intensity: 0 });
  const currentFresnel = useRef({ intensity: 0, opacity: 0 });

  const targetRotation = useRef({ x: 0, y: 0 });
  const isAnimating = useRef(false);

  const toggleFilter = useCallback(() => setFilter((f) => !f), []);

  // Smooth lerp helper
  const lerp = (current: number, target: number, factor: number) =>
    current + (target - current) * factor;

  // Smooth animation loop
  const animate = useCallback(() => {
    const container = containerRef.current;
    const glow = glowRef.current;
    const specular = specularRef.current;
    const shine = shineRef.current;
    const fresnel = fresnelRef.current;
    if (!container) return;

    const current = currentRotation.current;
    const target = targetRotation.current;

    // Very smooth interpolation with low lerp factor
    const rotationLerp = 0.04;
    const lightLerp = 0.06;
    const intensityLerp = 0.05;

    current.x = lerp(current.x, target.x, rotationLerp);
    current.y = lerp(current.y, target.y, rotationLerp);

    // Apply transform with slight scale for depth
    const scale = 1 + Math.abs(current.x + current.y) * 0.001;
    container.style.transform = `perspective(1200px) rotateX(${current.x}deg) rotateY(${current.y}deg) scale3d(${scale}, ${scale}, 1)`;

    // Calculate target intensity based on rotation magnitude
    const rotationMagnitude = Math.sqrt(
      current.x * current.x + current.y * current.y
    );
    const targetIntensity = Math.min(rotationMagnitude / 12, 1);

    // Smoothly interpolate glow position and intensity
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
        0.08 + targetIntensity * 0.12,
        intensityLerp
      );

      glow.style.background = `radial-gradient(ellipse at ${currentGlow.current.x}% ${currentGlow.current.y}%, rgba(255,255,255,${currentGlow.current.intensity}) 0%, transparent 70%)`;
    }

    // Smoothly interpolate specular highlight
    if (specular) {
      const targetSpecX = 50 + current.y * 4;
      const targetSpecY = 50 - current.x * 4;
      const targetSpecIntensity = targetIntensity * 0.5;

      currentSpecular.current.x = lerp(
        currentSpecular.current.x,
        targetSpecX,
        lightLerp * 0.8
      );
      currentSpecular.current.y = lerp(
        currentSpecular.current.y,
        targetSpecY,
        lightLerp * 0.8
      );
      currentSpecular.current.intensity = lerp(
        currentSpecular.current.intensity,
        targetSpecIntensity,
        intensityLerp
      );

      specular.style.background = `radial-gradient(circle at ${
        currentSpecular.current.x
      }% ${currentSpecular.current.y}%, rgba(255,255,255,${
        currentSpecular.current.intensity
      }) 0%, rgba(255,255,255,${
        currentSpecular.current.intensity * 0.3
      }) 25%, transparent 55%)`;
    }

    // Smoothly interpolate shine streak
    if (shine) {
      const targetShineAngle =
        Math.atan2(current.x, current.y) * (180 / Math.PI) + 90;
      const targetShineOffset = 50 + current.y * 2;
      const targetShineIntensity = 0.08 + targetIntensity * 0.12;

      // Handle angle wrapping smoothly
      let angleDiff = targetShineAngle - currentShine.current.angle;
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;

      currentShine.current.angle =
        currentShine.current.angle + angleDiff * lightLerp;
      currentShine.current.offset = lerp(
        currentShine.current.offset,
        targetShineOffset,
        lightLerp
      );
      currentShine.current.intensity = lerp(
        currentShine.current.intensity,
        targetShineIntensity,
        intensityLerp
      );

      shine.style.background = `linear-gradient(${
        currentShine.current.angle
      }deg, transparent 0%, transparent ${
        currentShine.current.offset - 20
      }%, rgba(255,255,255,${currentShine.current.intensity}) ${
        currentShine.current.offset
      }%, transparent ${currentShine.current.offset + 20}%, transparent 100%)`;
    }

    // Smoothly interpolate fresnel effect
    if (fresnel) {
      const targetFresnelIntensity = targetIntensity * 0.35;
      const targetOpacity = Math.min(targetIntensity * 1.2, 0.8);

      currentFresnel.current.intensity = lerp(
        currentFresnel.current.intensity,
        targetFresnelIntensity,
        intensityLerp * 0.7
      );
      currentFresnel.current.opacity = lerp(
        currentFresnel.current.opacity,
        targetOpacity,
        intensityLerp * 0.7
      );

      const gradientDir1 = current.y >= 0 ? "90deg" : "270deg";
      const gradientDir2 = current.x <= 0 ? "0deg" : "180deg";

      fresnel.style.background = `
        linear-gradient(${gradientDir1}, rgba(255,255,255,${
        currentFresnel.current.intensity
      }) 0%, transparent 35%),
        linear-gradient(${gradientDir2}, rgba(255,255,255,${
        currentFresnel.current.intensity * 0.6
      }) 0%, transparent 30%)
      `;
      fresnel.style.opacity = `${currentFresnel.current.opacity}`;
    }

    // Continue animation with very low threshold for smoothness
    const threshold = 0.001;
    if (
      Math.abs(target.x - current.x) > threshold ||
      Math.abs(target.y - current.y) > threshold ||
      Math.abs(
        currentGlow.current.intensity - (0.08 + targetIntensity * 0.12)
      ) > threshold
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

    // Cache de valores para evitar recálculos
    let cachedRect: DOMRect | null = null;
    let cachedEffectiveRange = 550;
    let cachedMaxRotation = 12;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let frameRequested = false;

    // Atualiza cache de dimensões (apenas no resize)
    const updateCache = () => {
      cachedRect = container.getBoundingClientRect();
      const vw = window.innerWidth;
      cachedEffectiveRange = vw < 768 ? 250 : vw < 1024 ? 400 : 550;
      cachedMaxRotation = vw < 768 ? 8 : 12;
    };
    updateCache();

    // Processa movimento do mouse usando RAF para coalescer eventos
    const processMouseMove = () => {
      frameRequested = false;
      if (!cachedRect) return;

      const centerX = cachedRect.left + cachedRect.width / 2;
      const centerY = cachedRect.top + cachedRect.height / 2;
      const deltaX = lastMouseX - centerX;
      const deltaY = lastMouseY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > cachedEffectiveRange) {
        targetRotation.current = { x: 0, y: 0 };
        startAnimation();
        return;
      }

      const falloff = easeOutCubic(1 - distance / cachedEffectiveRange);
      const normalizedX = deltaX / (cachedRect.width / 2);
      const normalizedY = deltaY / (cachedRect.height / 2);

      const rotateY =
        Math.max(
          -cachedMaxRotation,
          Math.min(cachedMaxRotation, normalizedX * cachedMaxRotation)
        ) * falloff;
      const rotateX =
        Math.max(
          -cachedMaxRotation,
          Math.min(cachedMaxRotation, -normalizedY * cachedMaxRotation)
        ) * falloff;

      targetRotation.current = { x: rotateX, y: rotateY };
      startAnimation();
    };

    const handleMouseMove = (event: MouseEvent) => {
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;

      // Coalescência de eventos usando RAF
      if (!frameRequested) {
        frameRequested = true;
        requestAnimationFrame(processMouseMove);
      }
    };

    const handleMouseLeave = () => {
      targetRotation.current = { x: 0, y: 0 };
      startAnimation();
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        lastMouseX = touch.clientX;
        lastMouseY = touch.clientY;
        if (!frameRequested) {
          frameRequested = true;
          requestAnimationFrame(processMouseMove);
        }
      }
    };

    const handleTouchEnd = () => {
      targetRotation.current = { x: 0, y: 0 };
      startAnimation();
    };

    // Atualiza cache no resize com debounce
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateCache, 150);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      clearTimeout(resizeTimeout);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
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
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Fresnel edge glow - illuminates edges when tilted */}
        <div
          ref={fresnelRef}
          className="absolute inset-0 z-30 pointer-events-none rounded-3xl"
          style={{
            opacity: 0,
            mixBlendMode: "screen",
          }}
        />

        {/* Specular highlight - sharp light point */}
        <div
          ref={specularRef}
          className="absolute inset-0 z-[25] pointer-events-none rounded-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 0%, transparent 100%)",
            mixBlendMode: "overlay",
          }}
        />

        {/* Shine streak - moving light band */}
        <div
          ref={shineRef}
          className="absolute inset-0 z-[24] pointer-events-none rounded-3xl"
          style={{
            background: "transparent",
            mixBlendMode: "overlay",
          }}
        />

        {/* Diffuse ambient glow */}
        <div
          ref={glowRef}
          className="absolute inset-0 z-[23] pointer-events-none rounded-3xl"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)",
            mixBlendMode: "overlay",
          }}
        />

        {/* Base ambient occlusion - subtle depth shadow */}
        <div
          className="absolute inset-0 z-[22] pointer-events-none rounded-3xl"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.12) 100%)",
            mixBlendMode: "multiply",
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

        {/* Glass reflection effect - static highlight at top */}
        <div
          className="absolute inset-x-0 top-0 h-1/3 z-[21] pointer-events-none rounded-t-3xl"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
            mixBlendMode: "overlay",
          }}
        />

        {/* Subtle border shine effect */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-20"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 45%, transparent 55%, rgba(255,255,255,0.06) 100%)",
            mixBlendMode: "overlay",
          }}
        />

        {/* Inner shadow for depth */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-[19]"
          style={{
            boxShadow:
              "inset 0 1px 15px rgba(0,0,0,0.08), inset 0 -1px 15px rgba(0,0,0,0.04)",
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
      className="relative grid grid-cols-1 lg:grid-cols-2 items-center justify-center text-center px-4 w-full pt-28 lg:pt-32 max-w-8xl mx-auto isolation-auto"
    >
      <div className="flex flex-col justify-center items-center lg:h-screen gap-8 lg:gap-12">
        <div className="flex flex-col justify-center items-center lg:items-start lg:ml-32 mx-auto sm:pl-0 lg:pl-24">
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
        <div className="flex flex-wrap justify-center items-center lg:justify-start lg:items-start gap-2 lg:ml-32 h-fit mx-auto sm:pl-0 lg:pl-24">
          <SkillsList />
        </div>
      </div>

      <HeroImage />
    </section>
  );
}
