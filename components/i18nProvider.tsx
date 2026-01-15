"use client";
import React, { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/utils/i18n";

const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Após a montagem, verifica se há um idioma preferido no localStorage
    // e sincroniza com o i18n se necessário
    try {
      const storedLang = localStorage.getItem("i18nextLng");
      if (storedLang && (storedLang === "en" || storedLang === "pt")) {
        if (storedLang !== i18n.language) {
          i18n.changeLanguage(storedLang);
        }
      } else {
        // Se não há idioma salvo, tenta detectar do navegador
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith("pt")) {
          i18n.changeLanguage("pt");
        }
      }
    } catch (e) {
      // Se houver erro ao acessar localStorage, mantém o idioma padrão
      console.warn("Erro ao acessar localStorage:", e);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <div suppressHydrationWarning>
        {children}
      </div>
    </I18nextProvider>
  );
};

export default I18nProvider;
