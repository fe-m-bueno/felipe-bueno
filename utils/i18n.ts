import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../locales/en/translation.json';
import ptTranslation from '../locales/pt/translation.json';
import esTranslation from '../locales/es/translation.json';

const isServer = typeof window === 'undefined';

const i18nInstance = i18n.use(initReactI18next);

// Só usa o LanguageDetector no cliente para evitar erros de hidratação
if (!isServer) {
  i18nInstance.use(LanguageDetector);
}

i18nInstance.init({
  resources: {
    en: { translation: enTranslation },
    pt: { translation: ptTranslation },
    es: { translation: esTranslation },
  },
  lng: isServer ? 'en' : undefined, // Força 'en' no servidor, deixa o detector escolher no cliente
  fallbackLng: 'en',
  debug: false,
  detection: {
    order: ['localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage', 'sessionStorage'],
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
