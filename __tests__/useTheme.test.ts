import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '@/hooks/useTheme';

function clearDOMTheme() {
  document.documentElement.removeAttribute('data-mode');
  document.documentElement.classList.remove('dark');
  localStorage.clear();
}

describe('useTheme', () => {
  beforeEach(() => {
    clearDOMTheme();
  });

  afterEach(() => {
    clearDOMTheme();
  });

  describe('initial theme detection', () => {
    it('defaults to light when no DOM attribute or localStorage is set', () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');
    });

    it('reads dark theme from DOM data-mode attribute', () => {
      document.documentElement.setAttribute('data-mode', 'dark');
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('dark');
    });

    it('reads light theme from DOM data-mode attribute', () => {
      document.documentElement.setAttribute('data-mode', 'light');
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');
    });

    it('falls back to localStorage when DOM attribute is not set', () => {
      localStorage.setItem('theme', 'dark');
      const { result } = renderHook(() => useTheme());
      // After mount effect runs, theme syncs from localStorage
      expect(result.current.theme).toBe('dark');
    });

    it('ignores invalid DOM attribute values', () => {
      document.documentElement.setAttribute('data-mode', 'blue');
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');
    });

    it('ignores invalid localStorage values', () => {
      localStorage.setItem('theme', 'invalid-theme');
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('light');
    });
  });

  describe('mounted state', () => {
    it('sets mounted to true after mount', async () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.mounted).toBe(true);
    });
  });

  describe('toggleTheme', () => {
    it('toggles from light to dark', () => {
      document.documentElement.setAttribute('data-mode', 'light');
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
    });

    it('toggles from dark to light', () => {
      document.documentElement.setAttribute('data-mode', 'dark');
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
    });

    it('persists new theme to localStorage after toggle', () => {
      document.documentElement.setAttribute('data-mode', 'light');
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('updates DOM data-mode attribute after toggle to dark', () => {
      document.documentElement.setAttribute('data-mode', 'light');
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
    });

    it('adds dark class to documentElement when toggling to dark', () => {
      document.documentElement.setAttribute('data-mode', 'light');
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes dark class from documentElement when toggling to light', () => {
      document.documentElement.setAttribute('data-mode', 'dark');
      document.documentElement.classList.add('dark');
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('double toggle returns to original theme', () => {
      document.documentElement.setAttribute('data-mode', 'light');
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });
      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
    });
  });
});
