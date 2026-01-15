"use client";
import React, { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/utils/i18n";

const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {/* Usa key para forçar re-render após hidratação, evitando mismatch */}
      <div key={isClient ? "client" : "server"} suppressHydrationWarning>
        {children}
      </div>
    </I18nextProvider>
  );
};

export default I18nProvider;
