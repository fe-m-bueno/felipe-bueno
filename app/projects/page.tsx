"use client";

import { useTranslation } from "react-i18next";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

type LocaleKey = "en" | "pt" | "es";
export default function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language.split("-")[0] as LocaleKey) || "en";
  const data = projects[locale] || projects.en;

  return (
    <div className="w-screen mx-auto py-6 md:px-16 px-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mt-10 mb-6">
        {t("projects.alltitle")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full">
        {data.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            image={project.image}
            link={project.link}
            github={project.github}
            techs={project.techs}
            height={450}
          />
        ))}
      </div>
    </div>
  );
}
