"use client";
import React, { useEffect, useRef } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/utils/i18n";

const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    queueMicrotask(() => {
      try {
        const storedLang = localStorage.getItem("i18nextLng");
        if (storedLang && (storedLang === "en" || storedLang === "pt")) {
          if (storedLang !== i18n.language) {
            i18n.changeLanguage(storedLang);
          }
        } else {
          const browserLang = navigator.language.toLowerCase();
          if (browserLang.startsWith("pt")) {
            i18n.changeLanguage("pt");
            localStorage.setItem("i18nextLng", "pt");
          }
        }
      } catch (e) {
        console.warn("Erro ao acessar localStorage:", e);
      }
    });
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};

export default I18nProvider;
