"use client";

import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import ProjectCard from "./ProjectCard";
import SpecularButton from "./SpecularButton";
import { haptic } from "@/lib/haptic";
import { useContentfulContent } from "@/hooks/useContentfulContent";

type LocaleKey = "en" | "pt";

export default function ProjectsSection() {
  const { i18n, t } = useTranslation();
  const locale = (i18n.language.split("-")[0] as LocaleKey) || "en";
  const { content } = useContentfulContent(locale);
  const data = content.projects;

  return (
    <section className="relative w-full mx-auto py-6 md:px-16 px-4 max-w-7xl">
      <div className="flex items-center justify-center">
        <h1 className="~text-2xl/3xl font-bold mt-4 mb-6">
          {t("projects.title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-6 w-full px-2 md:px-8">
        {data.slice(0, 4).map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            image={project.image}
            link={project.link}
            github={project.github}
            techs={project.techs}
            metrics={project.metrics}
          />
        ))}
      </div>
      <div className="flex items-center justify-center md:items-end md:justify-end mt-4">
        <SpecularButton
          href="/projects"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => haptic()}
          size="sm"
          radius={16}
          tint="#09090b"
          tintOpacity={0.92}
          blur={12}
          lineColor="#ffe4e6"
          baseColor="#27272a"
          intensity={1.25}
          className="group"
        >
          <span className="inline-flex items-center gap-2">
            {t("projects.seeAllProjects")}
            <ArrowUpRight className="w-6 h-6 hover:translate-x-1 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all ease-in-out duration-200" />
          </span>
        </SpecularButton>
      </div>
    </section>
  );
}
