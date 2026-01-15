"use client";
import { useTranslation } from "react-i18next";
import LiquidGlass from "./LiquidGlass";

export default function OpenToWorkBadge() {
  const { t } = useTranslation();

  return (
    <LiquidGlass
      variant="badge"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 cursor-default group"
    >
      {/* Indicador de status com efeito de pulso */}
      <span className="relative flex h-2 w-2 shrink-0">
        {/* Anel de pulso externo */}
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500/75 dark:bg-emerald-400/75" />
        {/* Ponto central com gradiente e glow */}
        <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-300 dark:to-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] dark:shadow-[0_0_8px_rgba(52,211,153,0.5)] group-hover:shadow-[0_0_10px_rgba(16,185,129,0.8)] dark:group-hover:shadow-[0_0_12px_rgba(52,211,153,0.7)] transition-shadow duration-300" />
      </span>
      {/* Texto do status */}
      <span className="inline-flex text-xs lg:text-sm font-space-grotesk whitespace-nowrap transition-colors duration-200">
        {t("openToWork.status")}
      </span>
    </LiquidGlass>
  );
}
