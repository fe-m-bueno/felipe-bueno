"use client";
import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Theme Toggle"
      className="relative flex ~h-6/8 ~w-12/16 items-center rounded-full border border-gray-200 bg-gray-100 p-1 transition-colors dark:border-gray-400 dark:bg-[#242424] focus:ring-2 focus:ring-orange-500"
    >
      <div
        className={`absolute  ~h-5/6 ~w-5/6 transform rounded-full bg-white shadow-md transition-transform duration-300 dark:bg-slate-950 items-center justify-center flex ${
          theme === "dark" ? "~translate-x-5/8" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? (
          <Moon className="m-1 ~h-3/4 ~w-3/4 text-white" />
        ) : (
          <Sun className="m-1 ~h-3/4 ~w-3/4" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
