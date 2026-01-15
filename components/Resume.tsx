"use client";
import { useTranslation } from "react-i18next";
import { resume } from "@/data/resume";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import LiquidGlass from "./LiquidGlass";

type LocaleKey = "en" | "pt" | "es";

export default function Resume() {
  const { i18n, t } = useTranslation();
  const locale = (i18n.language.split("-")[0] as LocaleKey) || "en";
  const data = resume[locale] || resume.en;

  return (
    <section className="px-6 py-6 lg:py-24 flex flex-col justify-start min-h-screen">
      <h2 className="~text-xl/2xl font-bold">{t("resume.experience")}</h2>
      <ul className="my-4 space-y-4">
        {data.experience.map((exp, index) => (
          <LiquidGlass key={index} variant="card" className="p-6 !rounded-3xl">
            <h4 className="~text-lg/xl font-bold">{exp.company}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {exp.role} - {exp.date}
            </p>
            <p className="mt-2">{exp.description}</p>
          </LiquidGlass>
        ))}
      </ul>

      <h2 className="mt-6 ~text-xl/2xl font-bold">{t("resume.education")}</h2>
      <ul className="my-4 space-y-4">
        {data.education.map((edu, index) => (
          <LiquidGlass key={index} variant="card" className="p-6 !rounded-3xl">
            <h4 className="~text-lg/xl font-bold">{edu.institution}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {edu.degree} - {edu.date}
            </p>
          </LiquidGlass>
        ))}
      </ul>

      <h3 className="mt-6 ~text-xl/2xl font-bold">
        {t("resume.additionalEducation")}
      </h3>
      <ul className="my-4 space-y-4">
        {data.additionalEducation.map((edu, index) => (
          <LiquidGlass key={index} variant="card" className="p-6 !rounded-3xl">
            <h4 className="~text-lg/xl font-bold">{edu.institution}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {edu.degree} - {edu.date}
            </p>
          </LiquidGlass>
        ))}
      </ul>

      <div className="mt-6 flex flex-col items-center justify-center lg:items-end lg:justify-end">
        <Link
          href={data.pdf}
          target="_blank"
          className="inline-flex items-center gap-2 px-3 py-2 hover:bg-white/85 hover:shadow-sm dark:hover:bg-white/5 rounded-lg transition-all ease-in-out duration-200 group "
        >
          <span className="inline-flex items-center gap-2">
            {t("resume.seeFullResume")}
            <ArrowUpRight className="w-6 h-6 hover:translate-x-1 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all ease-in-out duration-200" />
          </span>
        </Link>
      </div>
    </section>
  );
}
