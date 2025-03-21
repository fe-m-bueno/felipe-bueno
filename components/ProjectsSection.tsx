import { useTranslation } from "react-i18next";
import { ArrowUpRight, ArrowRight, ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import Link from "next/link";

type LocaleKey = "en" | "pt" | "es";

export default function ProjectsSection() {
  const { i18n, t } = useTranslation();
  const locale = (i18n.language.split("-")[0] as LocaleKey) || "en";
  const data = projects[locale] || projects.en;

  return (
    <section className="relative w-screen mx-auto py-6 md:px-16 px-4">
      <div className="flex items-center justify-center">
        <h1 className="~text-2xl/3xl font-bold mt-10 mb-6">
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
          />
        ))}
      </div>
      <div className="flex items-center justify-center md:items-end md:justify-end mt-4">
        <Link
          href="/projects"
          target="_blank"
          className="inline-flex items-center gap-2 px-3 py-2 hover:bg-white/85 hover:shadow-sm dark:hover:bg-white/5 rounded-lg transition-all ease-in-out duration-200 group "
        >
          <span className="inline-flex items-center gap-2">
            {t("projects.seeAllProjects")}
            <ArrowUpRight className="w-6 h-6 hover:translate-x-1 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all ease-in-out duration-200" />
          </span>
        </Link>
      </div>
      <Link
        href="#about"
        className="hidden md:block absolute top-1/2 -translate-y-1/2 left-8 z-10 cursor-pointer transition-all duration-100 hover:scale-110 active:scale-105 bg-white/85 backdrop-blur rounded-full p-2 border border-gray-200 "
      >
        <ArrowLeft className="w-6 h-6 text-black" />
      </Link>
      <Link
        href="#contact"
        className="hidden md:block absolute top-1/2 -translate-y-1/2 right-8 z-10 cursor-pointer transition-all duration-100 hover:scale-110 active:scale-105 bg-white/85 backdrop-blur rounded-full p-2 border border-gray-200 "
      >
        <ArrowRight className="w-6 h-6 text-black" />
      </Link>
    </section>
  );
}
