import { cookies, headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  localeFromAcceptLanguage,
  normalizeLocale,
  type LocaleKey,
} from "@/lib/locale";

export async function getServerLocale(): Promise<LocaleKey> {
  const cookieStore = await cookies();
  const savedLocale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
  if (savedLocale) {
    return savedLocale;
  }

  const headerStore = await headers();
  return localeFromAcceptLanguage(headerStore.get("accept-language")) ?? DEFAULT_LOCALE;
}
