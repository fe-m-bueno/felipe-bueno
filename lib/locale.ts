export type LocaleKey = "en" | "pt";

export const LOCALE_COOKIE_NAME = "lang";
export const DEFAULT_LOCALE: LocaleKey = "en";

const LOCALE_COOKIE_MAX_AGE = 31536000;

export function normalizeLocale(value: string | null | undefined): LocaleKey | null {
  if (!value) return null;

  const language = value.toLowerCase();
  if (language.startsWith("pt")) return "pt";
  if (language.startsWith("en")) return "en";
  return null;
}

export function readLocaleFromCookie(
  cookieHeader: string | null | undefined,
): LocaleKey | null {
  if (!cookieHeader) return null;

  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE_NAME}=([^;]*)`),
  );
  return normalizeLocale(match?.[1]);
}

export function serializeLocaleCookie(locale: LocaleKey): string {
  return `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}

export function localeFromAcceptLanguage(
  header: string | null | undefined,
): LocaleKey | null {
  if (!header) return null;

  const candidates = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const quality = params
        .map((param) => param.trim())
        .find((param) => param.startsWith("q="));

      return {
        locale: normalizeLocale(tag),
        quality: quality ? Number.parseFloat(quality.slice(2)) || 0 : 1,
      };
    })
    .filter((candidate): candidate is { locale: LocaleKey; quality: number } =>
      Boolean(candidate.locale),
    )
    .sort((a, b) => b.quality - a.quality);

  return candidates[0]?.locale ?? null;
}
