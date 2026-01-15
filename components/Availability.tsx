"use client";
import { useTranslation } from "react-i18next";
import { about } from "@/data/about";
import { Briefcase, MapPin, Clock, Globe } from "lucide-react";
import LiquidGlass from "./LiquidGlass";

type LocaleKey = "en" | "pt";

export default function Availability() {
  const { i18n } = useTranslation();
  const locale = (i18n.language.split("-")[0] as LocaleKey) || "en";
  const data = about[locale] || about.en;

  if (!data.availability) return null;

  const { status, types, locations, timezone, overlap } = data.availability;

  return (
    <LiquidGlass variant="card" className="p-6 !rounded-3xl mt-6">
      <div className="flex flex-col gap-4">
        <h3 className="~text-lg/xl font-bold flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-rose-500" />
          {status}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                {locale === "pt" ? "Tipos de trabalho:" : "Work types:"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {types.join(" • ")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                {locale === "pt" ? "Localizações:" : "Locations:"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {locations.join(" • ")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                {locale === "pt" ? "Fuso horário:" : "Timezone:"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{timezone}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                {locale === "pt" ? "Disponibilidade:" : "Availability:"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{overlap}</p>
            </div>
          </div>
        </div>
      </div>
    </LiquidGlass>
  );
}
