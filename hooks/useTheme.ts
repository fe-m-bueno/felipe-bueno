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
  const [mounted, setMounted] = useState(false);

  const applyTheme = useCallback((newTheme: Theme) => {
    document.documentElement.setAttribute('data-mode', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    // Sincroniza com o estado atual do DOM, localStorage ou cookie como fallback
    let currentTheme: Theme = 'light';
    try {
      const domTheme = normalizeTheme(document.documentElement.getAttribute('data-mode'));
      if (domTheme) {
        currentTheme = domTheme;
      } else {
        const storedTheme = normalizeTheme(localStorage.getItem('theme'));
        if (storedTheme) {
          currentTheme = storedTheme;
        } else {
          const cookieTheme = readThemeFromCookie(document.cookie);
          if (cookieTheme) {
            currentTheme = cookieTheme;
          }
        }
      }
    } catch (e) {
      // Mantém o tema padrão em caso de erro
    }
    applyTheme(currentTheme);
    document.cookie = serializeThemeCookie(currentTheme);
    setTheme(currentTheme);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.cookie = serializeThemeCookie(newTheme);
    applyTheme(newTheme);
  }, [theme, applyTheme]);

  return { theme, toggleTheme, mounted };
}
