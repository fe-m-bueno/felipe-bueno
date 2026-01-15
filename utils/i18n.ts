import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "../locales/en/translation.json";
import ptTranslation from "../locales/pt/translation.json";

const isServer = typeof window === "undefined";

const i18nInstance = i18n.use(initReactI18next);

// Sempre usa 'en' como idioma inicial para garantir consistência entre servidor e cliente
// O idioma será ajustado após a hidratação no componente I18nProvider
const defaultLanguage = "en";

i18nInstance.init({
  resources: {
    en: { translation: enTranslation },
    pt: { translation: ptTranslation },
  },
  lng: defaultLanguage, // Sempre começa com 'en' para evitar mismatch
  fallbackLng: defaultLanguage,
  debug: false,
  // Não usa detecção automática na inicialização para evitar mismatch
  // O idioma será ajustado manualmente após a hidratação
  interpolation: {
    escapeValue: false,
  },
});

// Adiciona o LanguageDetector após a inicialização, mas ele não será usado automaticamente
// O idioma será gerenciado manualmente no I18nProvider
if (!isServer) {
  i18nInstance.use(LanguageDetector);
}

export default i18n;
