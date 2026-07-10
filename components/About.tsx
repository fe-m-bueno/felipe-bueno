"use client";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import RecentTrack from "./RecentTrack";
import LiquidGlass from "./LiquidGlass";
import Availability from "./Availability";
import { useContentfulContent } from "@/hooks/useContentfulContent";

type LocaleKey = "en" | "pt";

export default function About() {
  const { i18n } = useTranslation();
  const locale = (i18n.language.split("-")[0] as LocaleKey) || "en";
  const { content } = useContentfulContent(locale);
  const data = content.about;
  const prefersReducedMotion = useReducedMotion();

  if (!data) return null;

  return (
    <section className="px-6 py-6 lg:pt-24 lg:pb-10 flex flex-col justify-start min-h-screen">
      <h2 className="~text-xl/2xl font-bold">{data.title}</h2>
      <LiquidGlass className="mt-4 p-6">
        <p className="whitespace-pre-line">{data.description}</p>
      </LiquidGlass>

      <Availability />

      <h3 className="mt-6 ~text-xl/2xl font-semibold">TLDR</h3>
      <ul className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
        {data.tldr.map((item, index) => (
          <motion.li
            key={index}
            initial={
              prefersReducedMotion ? false : { opacity: 0, y: 12 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.35,
              delay: prefersReducedMotion ? 0 : index * 0.06,
            }}
            className="flex"
          >
            <LiquidGlass
              variant="badge"
              className="inline-flex w-full items-center gap-2 px-4 py-2 !rounded-2xl cursor-default"
            >
              <span className="inline-flex ~text-sm/base">{item}</span>
            </LiquidGlass>
          </motion.li>
        ))}
      </ul>

      <RecentTrack />
    </section>
  );
}
