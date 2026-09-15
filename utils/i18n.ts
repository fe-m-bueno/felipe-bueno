import { createInstance, type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "../locales/en/translation.json";
import ptTranslation from "../locales/pt/translation.json";
import { DEFAULT_LOCALE, type LocaleKey } from "@/lib/locale";

export type UiCopy = Record<string, unknown>;

const isServer = typeof window === "undefined";

let clientInstance: I18nInstance | null = null;

function applyUiCopy(instance: I18nInstance, locale: LocaleKey, uiCopy: UiCopy) {
  if (!uiCopy || typeof uiCopy !== "object" || Object.keys(uiCopy).length === 0) {
    return;
  }

  instance.addResourceBundle(locale, "translation", uiCopy, true, true);
}

function buildInstance(locale: LocaleKey, uiCopy: UiCopy) {
  const instance = createInstance();

  instance.use(initReactI18next).init({
    resources: {
      en: { translation: enTranslation },
      pt: { translation: ptTranslation },
    },
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    initImmediate: false,
  });

  applyUiCopy(instance, locale, uiCopy);
  return instance;
}

export function syncI18nInstance(
  instance: I18nInstance,
  locale: LocaleKey,
  uiCopy: UiCopy,
) {
  applyUiCopy(instance, locale, uiCopy);

  if (instance.language !== locale) {
    void instance.changeLanguage(locale);
  }
}

export function resolveI18nInstance(locale: LocaleKey, uiCopy: UiCopy) {
  if (isServer) {
    return buildInstance(locale, uiCopy);
  }

  if (!clientInstance) {
    clientInstance = buildInstance(locale, uiCopy);
    return clientInstance;
  }

  syncI18nInstance(clientInstance, locale, uiCopy);
  return clientInstance;
}
