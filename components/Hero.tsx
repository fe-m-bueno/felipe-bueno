"use client";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef, useMemo, memo, useCallback } from "react";
import { EyeClosed } from "lucide-react";
import Badge from "@/components/Badge";

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

// Memoized Badge component to prevent unnecessary re-renders
const MemoizedBadge = memo(Badge);

// Memoized skills list
const SkillsList = memo(function SkillsList() {
  return (
    <>
      {skills.map((skill) => (
        <MemoizedBadge key={skill.name} name={skill.name} icon={skill.icon} />
      ))}
    </>
  );
});

// Separate component for the 3D image effect - isolated re-renders
const HeroImage = memo(function HeroImage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const toggleFilter = useCallback(() => setFilter((f) => !f), []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate rotation based on mouse position relative to element center
        const rotateY =
          ((event.clientX - centerX) / (window.innerWidth / 2)) * 15;
        const rotateX =
          ((centerY - event.clientY) / (window.innerHeight / 2)) * 15;

        container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    };

    const handleMouseLeave = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      // Reset to initial position with transition
      if (container) {
        container.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center mt-8 lg:mt-0 will-change-transform transition-transform duration-150 ease-out"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="rounded-3xl p-px h-1/2 w-1/2 lg:h-full overflow-hidden bg-gradient-to-b from-rose-400 to-rose-400/10 shadow-2xl shadow-white/10"
        onClick={toggleFilter}
      >
        {filter && (
          <p className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-base z-10 text-white font-semibold px-8 lg:px-0">
            <span className="inline-flex items-center gap-2">
              <EyeClosed className="w-6 h-6" /> {t("hero.clickToRemoveBlur")}
            </span>
          </p>
        )}
        <div className="relative p-[2px] rounded-[calc(1.25rem-1px)]">
          <div
            className={`absolute inset-0 p-px rounded-3xl transition-all duration-200 ${
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
      </div>
    </div>
  );
});

export default function Hero() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

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

  return (
    <section className="relative grid grid-cols-1 lg:grid-cols-2 items-center justify-center text-center px-4 w-full mt-24 lg:mt-0 lg:pt-20 max-w-8xl mx-auto">
      <div className="flex flex-col justify-center items-center lg:h-screen gap-8 lg:gap-12">
        <div className="flex flex-col justify-center items-center lg:items-start lg:ml-32 mx-auto sm:pl-0 lg:pl-24">
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
            className="~text-base/2xl mb-0 text-center lg:text-start font-semibold"
            {...delayedAnimationProps}
          >
            {t("hero.description2")}
          </motion.p>
        </div>
        <div className="flex flex-wrap justify-center items-center lg:justify-start lg:items-start gap-2 lg:ml-32 h-fit mx-auto sm:pl-0 lg:pl-24">
          <SkillsList />
        </div>
      </div>

      <HeroImage />
    </section>
  );
}
