import { useState, useEffect, useCallback } from 'react';
import { Theme, normalizeTheme, readThemeFromCookie, serializeThemeCookie } from '@/lib/theme';

// Função para obter o tema inicial do DOM (setado pelo script inline no layout)
function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    // Primeiro tenta ler do DOM (setado pelo script inline)
    const domTheme = normalizeTheme(document.documentElement.getAttribute('data-mode'));
    if (domTheme) {
      return domTheme;
    }
    // Fallback: lê diretamente do localStorage
    try {
      const storedTheme = normalizeTheme(localStorage.getItem('theme'));
      if (storedTheme) {
        return storedTheme;
      }
      const cookieTheme = readThemeFromCookie(document.cookie);
      if (cookieTheme) {
        return cookieTheme;
      }
    } catch (e) {
      // Ignora erros de localStorage
    }
  }
  return 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [mounted] = useState(() => typeof window !== 'undefined');

  const applyTheme = useCallback((newTheme: Theme) => {
    document.documentElement.setAttribute('data-mode', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    // Sincroniza sistemas externos com o tema inicial já calculado no estado.
    applyTheme(theme);
    document.cookie = serializeThemeCookie(theme);
  }, [applyTheme, theme]);

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.cookie = serializeThemeCookie(newTheme);
    applyTheme(newTheme);
  }, [theme, applyTheme]);

  return { theme, toggleTheme, mounted };
}
