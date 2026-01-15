"use client";
import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <button
      onClick={mounted ? toggleTheme : undefined}
      aria-label="Theme Toggle"
      className="relative flex ~h-6/8 ~w-12/16 items-center rounded-full border border-gray-200 bg-gray-100 p-1 transition-colors dark:border-gray-400 dark:bg-[#242424] focus:ring-2 focus:ring-rose-500"
    >
      {/* Usa CSS para mostrar a posição correta baseado no dark mode, evitando flicker */}
      <div
        className={`absolute ~h-5/6 ~w-5/6 transform rounded-full bg-white shadow-md transition-transform duration-300 dark:bg-slate-950 items-center justify-center flex translate-x-0 dark:~translate-x-5/8`}
      >
        {/* Ícone do Sol - visível no light mode */}
        <Sun className="m-1 ~h-3/4 ~w-3/4 block dark:hidden" />
        {/* Ícone da Lua - visível no dark mode */}
        <Moon className="m-1 ~h-3/4 ~w-3/4 text-white hidden dark:block" />
      </div>
    </button>
  );
};

export default ThemeToggle;
