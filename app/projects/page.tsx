"use client";

import { useTranslation } from "react-i18next";
import ProjectCard from "@/components/ProjectCard";
import { useContentfulContent } from "@/hooks/useContentfulContent";

type LocaleKey = "en" | "pt";
export default function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language.split("-")[0] as LocaleKey) || "en";
  const { content } = useContentfulContent(locale);
  const data = content.projects;

  return (
    <div className="w-screen mx-auto py-6 lg:px-16 px-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mt-10 mb-6">
        {t("projects.alltitle")}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 w-full">
        {data.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            image={project.image}
            link={project.link}
            github={project.github}
            techs={project.techs}
            metrics={project.metrics}
            height={450}
          />
        ))}
      </div>
    </div>
  );
}
