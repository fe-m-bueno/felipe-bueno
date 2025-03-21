import { useState, useEffect } from "react";

export type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = (localStorage.getItem("theme") as Theme) || "light";
    setTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  const applyTheme = (theme: Theme) => {
    document.documentElement.setAttribute("data-mode", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  };

  const toggleTheme = () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return { theme, toggleTheme };
}
