import { useTranslation } from "react-i18next";
import { about } from "@/data/about";
import RecentTrack from "./RecentTrack";

type LocaleKey = "en" | "pt" | "es";

export default function About() {
  const { i18n, t } = useTranslation();
  const locale = (i18n.language.split("-")[0] as LocaleKey) || "en";
  const data = about[locale] || about.en;

  return (
    <section className="px-6 py-6 lg:py-24 flex flex-col justify-between lg:h-screen min-h-screen">
      <h2 className="~text-xl/2xl font-bold">{data.title}</h2>
      <p className="mt-4 whitespace-pre-line text-justify backdrop-blur-3xl p-6 bg-white/[3%] rounded-3xl">
        {data.description}
      </p>

      <h3 className="mt-6 ~text-xl/2xl font-semibold">TLDR</h3>
      <ul className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
        {data.tldr.map((item, index) => (
          <li
            key={index}
            className="inline-flex items-center gap-2 dark:bg-black/50 bg-white/85 backdrop-blur hover:bg-rose-600/80 dark:hover:bg-rose-600/80 hover:text-white transition-colors duration-200 border dark:border-white/20 border-black/20 px-4 py-2 rounded-2xl cursor-default"
          >
            <span className="inline-flex ~text-sm/base">{item}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center justify-center">
        <h3 className="mt-6 ~text-xl/2xl font-semibold">
          {t("about.recentTrack")}
        </h3>
        <RecentTrack />
      </div>
    </section>
  );
}
