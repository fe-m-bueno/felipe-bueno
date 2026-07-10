"use client";
import Image from "next/image";
import Badge from "./Badge";
import Link from "next/link";
import { GitHub } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import LiquidGlass from "./LiquidGlass";
import { memo } from "react";
import { haptic } from "@/lib/haptic";

type ProjectProps = {
  title: string;
  description: string;
  image: string;
  link: string;
  github: string;
  techs: { name: string; icon: string }[];
  metrics?: string[];
  height?: number;
  priority?: boolean;
};

function ProjectCardComponent({
  title,
  description,
  image,
  link,
  github,
  techs,
  metrics,
  height,
  priority,
}: ProjectProps) {
  const { t } = useTranslation();
  return (
    <LiquidGlass
      variant="card"
      className="group relative flex h-full flex-col p-2 rounded-lg transition-transform duration-300 ease-out motion-safe:hover:-translate-y-1"
    >
      <div
        className="w-full overflow-hidden rounded-lg shrink-0"
        style={{ height: height ? `${height}px` : "14rem" }}
      >
        <Image
          src={image}
          alt={title}
          width={1980}
          height={1080}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          className="h-full w-full rounded-lg object-cover object-top transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{description}</p>

        {metrics && metrics.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {metrics.map((metric, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-rose-500/10 text-rose-600 border border-rose-500/30 rounded-md dark:bg-rose-500/20 dark:text-rose-200 dark:border-rose-400/30"
              >
                {metric}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 md:gap-2 mt-4">
          {techs.map((tech, index) => (
            <div key={index} className="flex items-center">
              {tech.icon ? (
                <Badge name={tech.name} icon={tech.icon} />
              ) : (
                <span className="text-xs md:text-sm">{tech.name}</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4 flex flex-wrap gap-2 md:gap-4">
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => haptic()}
            className="px-3 py-1 bg-rose-600/85 hover:bg-rose-500/85 backdrop-blur-md dark:bg-rose-600/85 dark:hover:bg-rose-700/85 border border-gray-200/20 rounded-xl text-white transition font-bold ~text-sm/base"
          >
            {t("projects.viewProject")}
          </Link>
          <Link
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => haptic()}
            className="px-3 py-1 bg-white/85 hover:bg-white/100 dark:bg-white/5 dark:hover:bg-white/25 backdrop-blur border border-gray-200/20 rounded-xl transition ~text-sm/base"
          >
            <span className="flex items-center justify-center gap-2">
              <GitHub className="w-6 h-6" />
              GitHub
            </span>
          </Link>
        </div>
      </div>
    </LiquidGlass>
  );
}

const ProjectCard = memo(ProjectCardComponent);
export default ProjectCard;
