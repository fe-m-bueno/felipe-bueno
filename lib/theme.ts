export type Theme = "light" | "dark";

export const THEME_COOKIE_NAME = "theme";

export function normalizeTheme(value: string | null | undefined): Theme | null {
  return value === "dark" || value === "light" ? value : null;
}

export function readThemeFromCookie(cookieHeader: string | null | undefined): Theme | null {
  if (!cookieHeader) return null;

  const match = cookieHeader.match(/(?:^|;\s*)theme=(dark|light)(?:;|$)/);
  return normalizeTheme(match?.[1]);
}

export function serializeThemeCookie(theme: Theme): string {
  return `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=31536000; samesite=lax`;
}
