"use client";
import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import AboutMe from "./AboutSection";
import ContactForm from "./ContactForm";
import Hero from "./Hero";
import ProjectsSection from "./ProjectsSection";
import TheFooter from "./TheFooter";

export default function SectionContainer() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    let isScrolling: NodeJS.Timeout;
    let accumulatedDelta = 0;

    const handleWheel = (e: WheelEvent) => {
      if (!mediaQuery.matches) return;

      e.preventDefault();
      accumulatedDelta += e.deltaY;
      clearTimeout(isScrolling);

      isScrolling = setTimeout(() => {
        const sections = container.children;
        const sectionWidth = container.clientWidth;
        const currentSection = Math.round(container.scrollLeft / sectionWidth);

        let targetSection;
        if (Math.abs(accumulatedDelta) > 50) {
          targetSection =
            accumulatedDelta > 0 ? currentSection + 1 : currentSection - 1;
        } else {
          targetSection = currentSection;
        }

        targetSection = Math.max(
          0,
          Math.min(targetSection, sections.length - 1)
        );
        container.scrollTo({
          left: targetSection * sectionWidth,
        });
        accumulatedDelta = 0;
      }, 30);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      clearTimeout(isScrolling);
    };
  }, []);
  return (
    <motion.div
      ref={scrollRef}
      className="lg:flex lg:overflow-x-auto lg:mt-0 overflow-y-auto lg:overflow-y-hidden lg:snap-x lg:snap-mandatory lg:h-screen flex flex-col lg:flex-row scroll-smooth no-scrollbar"
      style={{
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <section
        id="landing"
        className="w-full lg:w-screen h-full lg:h-screen flex flex-col justify-center items-center lg:snap-center"
      >
        <Hero />
      </section>
      <section
        id="about"
        className="w-full lg:w-screen h-full lg:h-screen flex flex-col justify-center items-center lg:snap-center"
      >
        <AboutMe />
      </section>
      <section
        id="projects"
        className="w-full lg:w-screen h-full lg:h-screen flex flex-col justify-center items-center lg:snap-center"
      >
        <ProjectsSection />
      </section>
      <section
        id="contact"
        className="relative w-full lg:w-screen h-full lg:h-screen flex flex-col lg:justify-center justify-between items-center lg:snap-center"
      >
        <ContactForm />
        <div className="lg:absolute lg:bottom-0">
          <TheFooter />
        </div>
      </section>
    </motion.div>
  );
}
