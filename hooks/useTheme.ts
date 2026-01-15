import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

// Função para obter o tema inicial do DOM (setado pelo script inline no layout)
function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    // Primeiro tenta ler do DOM (setado pelo script inline)
    const domTheme = document.documentElement.getAttribute('data-mode') as Theme;
    if (domTheme === 'dark' || domTheme === 'light') {
      return domTheme;
    }
    // Fallback: lê diretamente do localStorage
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
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

  useEffect(() => {
    setMounted(true);
    // Sincroniza com o estado atual do DOM (que foi setado pelo script inline)
    // ou do localStorage como fallback
    let currentTheme: Theme = 'light';
    try {
      const domTheme = document.documentElement.getAttribute('data-mode') as Theme;
      if (domTheme === 'dark' || domTheme === 'light') {
        currentTheme = domTheme;
      } else {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
          currentTheme = storedTheme;
        }
      }
    } catch (e) {
      // Mantém o tema padrão em caso de erro
    }
    setTheme(currentTheme);
  }, []);

  const applyTheme = useCallback((newTheme: Theme) => {
    document.documentElement.setAttribute('data-mode', newTheme);
    if (newTheme === 'dark') {
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

  return { theme, toggleTheme, mounted };
}
