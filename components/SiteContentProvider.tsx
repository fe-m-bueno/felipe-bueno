"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { ContentfulSiteContent } from "@/lib/contentfulContent";
import type { LocaleKey } from "@/lib/locale";

type SiteContentValue = {
  locale: LocaleKey;
  content: ContentfulSiteContent;
};

const SiteContentContext = createContext<SiteContentValue | null>(null);

export default function SiteContentProvider({
  locale,
  content,
  children,
}: SiteContentValue & { children: ReactNode }) {
  const value = useMemo(() => ({ locale, content }), [locale, content]);

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const value = useContext(SiteContentContext);

  if (!value) {
    throw new Error("useSiteContent must be used inside SiteContentProvider");
  }

  return value;
}
