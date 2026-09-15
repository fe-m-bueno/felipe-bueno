"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { I18nextProvider } from "react-i18next";
import { resolveI18nInstance, syncI18nInstance, type UiCopy } from "@/utils/i18n";
import {
  LOCALE_COOKIE_NAME,
  normalizeLocale,
  readLocaleFromCookie,
  serializeLocaleCookie,
  type LocaleKey,
} from "@/lib/locale";

const LEGACY_LANGUAGE_STORAGE_KEY = "i18nextLng";

type I18nProviderProps = {
  locale: LocaleKey;
  uiCopy: UiCopy;
  children: React.ReactNode;
};

const I18nProvider: React.FC<I18nProviderProps> = ({ locale, uiCopy, children }) => {
  const router = useRouter();
  const [i18n] = useState(() => resolveI18nInstance(locale, uiCopy));

  useEffect(() => {
    syncI18nInstance(i18n, locale, uiCopy);
  }, [i18n, locale, uiCopy]);

  useEffect(() => {
    if (readLocaleFromCookie(document.cookie)) return;

    let storedLocale: LocaleKey | null = null;
    try {
      storedLocale = normalizeLocale(
        window.localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY),
      );
    } catch (error) {
      console.warn(`Could not read ${LOCALE_COOKIE_NAME} from localStorage:`, error);
    }

    const preferredLocale = storedLocale ?? locale;
    document.cookie = serializeLocaleCookie(preferredLocale);

    if (preferredLocale !== locale) {
      router.refresh();
    }
  }, [locale, router]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18nProvider;
