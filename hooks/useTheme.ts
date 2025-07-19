import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = (localStorage.getItem('theme') as Theme) || 'light';
    setTheme(storedTheme);
  }, []);

  const applyTheme = useCallback((theme: Theme) => {
    document.documentElement.setAttribute('data-mode', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }, [theme, applyTheme]);

  // Sincronizar com o estado atual quando mounted
  useEffect(() => {
    if (mounted) {
      const currentTheme =
        (document.documentElement.getAttribute('data-mode') as Theme) ||
        'light';
      setTheme(currentTheme);
    }
  }, [mounted]);

  return { theme, toggleTheme, mounted };
}
