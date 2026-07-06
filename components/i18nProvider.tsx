"use client";
import React, { useEffect, useRef } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/utils/i18n";

type LocaleKey = "en" | "pt";

const loadedContentfulLocales = new Set<LocaleKey>();

async function loadContentfulCopy(locale: LocaleKey) {
  if (loadedContentfulLocales.has(locale)) return;

  const response = await fetch(`/api/content?locale=${locale}`);
  if (!response.ok) return;

  const content = await response.json();
  if (!content.uiCopy || typeof content.uiCopy !== "object") return;

  i18n.addResourceBundle(locale, "translation", content.uiCopy, true, true);
  loadedContentfulLocales.add(locale);
}

const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const applyLanguage = (language: string) => {
      const locale = language.startsWith("pt") ? "pt" : "en";
      loadContentfulCopy(locale).then(() => {
        if (i18n.language !== locale) {
          i18n.changeLanguage(locale);
        } else {
          i18n.emit("loaded", { [locale]: { translation: true } });
        }
      });
    };

    queueMicrotask(() => {
      try {
        const storedLang = localStorage.getItem("i18nextLng");
        if (storedLang && (storedLang === "en" || storedLang === "pt")) {
          applyLanguage(storedLang);
        } else {
          const browserLang = navigator.language.toLowerCase();
          if (browserLang.startsWith("pt")) {
            localStorage.setItem("i18nextLng", "pt");
            applyLanguage("pt");
          } else {
            applyLanguage("en");
          }
        }
      } catch (e) {
        console.warn("Erro ao acessar localStorage:", e);
        applyLanguage("en");
      }
    });

    const handleLanguageChanged = (language: string) => {
      const locale = language.startsWith("pt") ? "pt" : "en";
      void loadContentfulCopy(locale);
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};

export default I18nProvider;
