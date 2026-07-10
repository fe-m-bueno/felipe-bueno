"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  useState,
  useEffect,
  useRef,
  memo,
  useCallback,
  useSyncExternalStore,
} from "react";
import { EyeClosed, ArrowRight, Eye, Download, Plus, Minus } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import Badge from "@/components/Badge";
import OpenToWorkBadge from "@/components/OpenToWorkBadge";
import CountUpText from "@/components/CountUpText";
import { haptic } from "@/lib/haptic";
import { useContentfulContent } from "@/hooks/useContentfulContent";
import type { HeroSkill } from "@/lib/contentfulContent";

// Local fallback while Contentful loads (or if it's unreachable).
// Source of truth is the `technology` content type (heroOrder/heroTier fields).
const fallbackSkills = [
  { name: "Python", icon: "mdi:language-python" },
  { name: "Django", icon: "simple-icons:django" },
  { name: "TypeScript", icon: "bxl:typescript" },
  { name: "JavaScript", icon: "ri:javascript-fill" },
  { name: "PostgreSQL", icon: "mdi:database-outline" },
  { name: "Apache Airflow", icon: "simple-icons:apacheairflow" },
  { name: "Docker", icon: "mdi:docker" },
  { name: "React", icon: "mdi:react" },
  { name: "Next.js", icon: "ri:nextjs-fill" },
  { name: "Node.js", icon: "mdi:nodejs" },
  { name: "Vue.js", icon: "mdi:vuejs" },
  { name: "Tailwind CSS", icon: "mdi:tailwind" },
  { name: "Angular", icon: "mdi:angular" },
  { name: "LangGraph", icon: "mdi:graph" },
  { name: "GraphQL", icon: "mdi:graphql" },
  { name: "React Native", icon: "mdi:react" },
  { name: "Nuxt.js", icon: "lineicons:nuxt" },
  { name: "Svelte", icon: "ri:svelte-fill" },
  { name: "Apollo Studio", icon: "file-icons:apollo" },
  { name: "Drizzle", icon: "lineicons:drizzle" },
  { name: "Prisma", icon: "lineicons:prisma" },
  { name: "Figma", icon: "solar:figma-bold" },
  { name: "HTML", icon: "flowbite:html-solid" },
  { name: "CSS", icon: "flowbite:css-solid" },
];

const CORE_SKILLS_COUNT = 10;

const SkillsList = memo(function SkillsList({ skills }: { skills: HeroSkill[] }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const coreSkills = skills.filter((skill) => skill.tier === "core");
  const extraSkills = skills.filter((skill) => skill.tier === "extra");

  const toggleExpanded = useCallback(() => {
    haptic();
    setExpanded((value) => !value);
  }, []);

  return (
    <>
      {coreSkills.map((skill) => (
        <Badge key={skill.name} name={skill.name} icon={skill.icon} />
      ))}
      <AnimatePresence initial={false}>
        {expanded &&
          extraSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.85 }
              }
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  delay: prefersReducedMotion ? 0 : index * 0.025,
                  duration: 0.25,
                },
              }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
            >
              <Badge name={skill.name} icon={skill.icon} />
            </motion.div>
          ))}
      </AnimatePresence>
      <button
        type="button"
        onClick={toggleExpanded}
        aria-expanded={expanded}
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/60 transition-colors duration-200 text-xs lg:text-sm font-space-grotesk whitespace-nowrap"
      >
        {expanded ? (
          <>
            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
            {t("hero.lessSkills")}
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            {t("hero.moreSkills", { total: extraSkills.length })}
          </>
        )}
      </button>
    </>
  );
});

// Hydration-safe "(hover: hover)" media query: the server assumes a
// hover-capable device and touch devices correct themselves after hydration.
function subscribeToHoverCapability(callback: () => void) {
  const mql = window.matchMedia("(hover: hover)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function useCanHover() {
  return useSyncExternalStore(
    subscribeToHoverCapability,
    () => window.matchMedia("(hover: hover)").matches,
    () => true
  );
}

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

const lerp = (current: number, target: number, factor: number): number =>
  current + (target - current) * factor;

const HeroImage = memo(function HeroImage() {
  const { t } = useTranslation();
  // Blurred by default; hover reveals, click locks the reveal.
  // Touch devices (no hover) get the sharp photo.
  const canHover = useCanHover();
  const [locked, setLocked] = useState(false);
  const [hovering, setHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const currentRotation = useRef({ x: 0, y: 0 });
  const currentGlow = useRef({ x: 50, y: 50, intensity: 0.08 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const isAnimating = useRef(false);

  const filter = canHover && !locked && !hovering;

  const toggleFilter = useCallback(() => { haptic(); setLocked((f) => !f); }, []);
  const handleMouseEnter = useCallback(() => setHovering(true), []);
  const handleMouseLeave = useCallback(() => setHovering(false), []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const glow = glowRef.current;
    if (!container) return;

    let maxRotation = 12;

    const animate = () => {
      const current = currentRotation.current;
      const target = targetRotation.current;

      const rotationLerp = 0.08;
      const lightLerp = 0.1;

      current.x = lerp(current.x, target.x, rotationLerp);
      current.y = lerp(current.y, target.y, rotationLerp);

      container.style.transform = `perspective(1000px) rotateX(${current.x}deg) rotateY(${current.y}deg)`;

      const rotationMagnitude = Math.sqrt(
        current.x * current.x + current.y * current.y
      );
      const targetIntensity = 0.08 + Math.min(rotationMagnitude / 15, 0.25);

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

      const threshold = 0.01;
      if (
        Math.abs(target.x - current.x) > threshold ||
        Math.abs(target.y - current.y) > threshold
      ) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        isAnimating.current = false;
      }
    };

    const startAnimation = () => {
      if (!isAnimating.current) {
        isAnimating.current = true;
        animate();
      }
    };

    const processMove = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;

      const effectiveRange = Math.max(rect.width, rect.height) * 0.8;
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

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center mt-8 lg:mt-0"
      style={{
        isolation: "isolate",
        zIndex: 1,
      }}
    >
      <div
        ref={containerRef}
        className="relative rounded-3xl p-px h-1/2 w-1/2 lg:h-full overflow-hidden bg-gradient-to-b from-rose-400 to-rose-400/10 shadow-2xl shadow-rose-500/20 dark:shadow-rose-400/10 will-change-transform cursor-pointer"
        onClick={toggleFilter}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          ref={glowRef}
          className="absolute inset-0 z-30 pointer-events-none rounded-3xl"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)",
            mixBlendMode: "overlay",
          }}
        />

        <div
          className="absolute inset-x-0 top-0 h-1/3 z-20 pointer-events-none rounded-t-3xl"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)",
            mixBlendMode: "overlay",
          }}
        />

        {filter && (
          <p className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-base z-40 text-white font-semibold px-8 lg:px-0 drop-shadow-lg pointer-events-none">
            <span className="inline-flex items-center gap-2">
              <EyeClosed className="w-6 h-6" /> {t("hero.hoverToRemoveBlur")}
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
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

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
  const locale = (i18n.language.split("-")[0] as "en" | "pt") || "en";
  const prefersReducedMotion = useReducedMotion();
  const { content } = useContentfulContent(locale);
  const skills: HeroSkill[] =
    content.skills.length > 0
      ? content.skills
      : fallbackSkills.map((skill, index) => ({
          ...skill,
          tier: index < CORE_SKILLS_COUNT ? "core" : "extra",
        }));

  const containerVariants = {
    hidden: {},
    visible: {
      transition: prefersReducedMotion
        ? undefined
        : { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
        },
      };

  return (
    <section
      id="landing"
      className="relative grid grid-cols-1 lg:grid-cols-2 items-center justify-center text-center px-4 w-full pt-28 lg:pt-20 max-w-8xl mx-auto isolation-auto overflow-x-clip"
    >
      <motion.div
        className="flex flex-col justify-center items-center lg:min-h-screen gap-8 lg:gap-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col justify-center items-center lg:items-start lg:ml-16 mx-auto sm:pl-0 lg:pl-12">
          <motion.div variants={itemVariants} className="mb-6">
            <OpenToWorkBadge />
          </motion.div>
          <motion.h1 variants={itemVariants} className="~text-3xl/7xl mb-8">
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
            variants={itemVariants}
            className="~text-base/2xl mb-6 text-center lg:text-start"
          >
            {t("hero.description")}
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="~text-base/2xl mb-8 text-center lg:text-start font-semibold"
          >
            <CountUpText text={t("hero.description2")} />
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-3 justify-center lg:justify-start items-center w-full"
          >
            <Link
              href="#contact"
              onClick={() => haptic()}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 overflow-hidden
                bg-gradient-to-r from-rose-500 via-rose-600 to-rose-500 bg-[length:200%_100%] hover:bg-[position:100%_0]
                text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)]
                border border-rose-400/30 hover:border-rose-400/50
                hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">{t("cta.workTogether")}</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform duration-300" />
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            </Link>

            <Link
              href="#projects"
              onClick={() => haptic()}
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

            <Link
              href={
                locale === "pt"
                  ? "/pdfs/resume_2026_pt.pdf"
                  : "/pdfs/resume_2026_en.pdf"
              }
              target="_blank"
              download
              onClick={() => haptic()}
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
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center items-center lg:justify-start lg:items-start gap-2 lg:ml-16 h-fit mx-auto sm:pl-0 lg:pl-12"
        >
          <SkillsList skills={skills} />
        </motion.div>
      </motion.div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <HeroImage />
      </motion.div>
    </section>
  );
}
