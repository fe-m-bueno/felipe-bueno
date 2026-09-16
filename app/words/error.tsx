"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { haptic } from "@/lib/haptic";

/**
 * Uma queda do Contentful não pode se passar por "nenhum post publicado" nem
 * por 404: o leitor precisa saber que é temporário e poder tentar de novo.
 */
export default function WordsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Failed to load the blog", error);
  }, [error]);

  const { t } = useTranslation();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 lg:px-8">
      <div className="reading-surface px-6 py-14 text-center">
        <h1 className="font-space-grotesk ~text-2xl/3xl font-bold">
          {t("words.errorTitle")}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-gray-700 dark:text-gray-300">
          {t("words.errorDescription")}
        </p>
        <button
          type="button"
          onClick={() => {
            haptic();
            reset();
          }}
          className="mt-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-500/20 dark:text-rose-300"
        >
          {t("words.retry")}
        </button>
      </div>
    </div>
  );
}
