"use client";
import { useTranslation } from "react-i18next";
import { about } from "@/data/about";
import RecentTrack from "./RecentTrack";
import LiquidGlass from "./LiquidGlass";

type LocaleKey = "en" | "pt";

export default function About() {
  const { i18n, t } = useTranslation();
  const locale = (i18n.language.split("-")[0] as LocaleKey) || "en";
  const data = about[locale] || about.en;

  return (
    <section className="px-6 py-6 lg:py-24 flex flex-col justify-start min-h-screen">
      <h2 className="~text-xl/2xl font-bold">{data.title}</h2>
      <LiquidGlass className="mt-4 p-6">
        <p className="whitespace-pre-line text-justify">{data.description}</p>
      </LiquidGlass>

      <h3 className="mt-6 ~text-xl/2xl font-semibold">TLDR</h3>
      <ul className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
        {data.tldr.map((item, index) => (
          <LiquidGlass
            key={index}
            variant="badge"
            className="inline-flex items-center gap-2 px-4 py-2 !rounded-2xl cursor-default"
          >
            <span className="inline-flex ~text-sm/base">{item}</span>
          </LiquidGlass>
        ))}
      </ul>

      <div className="flex flex-col items-center justify-center mt-8">
        <h3 className="mt-6 ~text-xl/2xl font-semibold">
          {t("about.recentTrack")}
        </h3>
        <RecentTrack />
      </div>
    </section>
  );
}
