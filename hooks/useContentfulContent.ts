"use client";

import { useEffect, useState } from "react";
import type { LocaleKey } from "@/lib/contentfulContent";
import {
  clearContentfulContentCache as clearSharedContentfulContentCache,
  getCachedContentfulContent,
  getFallbackContent,
  prefetchContentfulContent,
} from "@/lib/contentfulClientCache";

export function useContentfulContent(locale: LocaleKey) {
  const [content, setContent] = useState(
    () => getCachedContentfulContent(locale) || getFallbackContent(locale),
  );
  const [isLoading, setIsLoading] = useState(!getCachedContentfulContent(locale));

  useEffect(() => {
    let cancelled = false;
    const cached = getCachedContentfulContent(locale);

    if (cached) {
      queueMicrotask(() => {
        if (!cancelled) {
          setContent(cached);
          setIsLoading(false);
        }
      });
      return;
    }

    queueMicrotask(() => {
      if (!cancelled) {
        setIsLoading(true);
      }
    });

    prefetchContentfulContent(locale)
      .then((nextContent) => {
        if (!cancelled) {
          setContent(nextContent);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setContent(getFallbackContent(locale));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return { content, isLoading };
}

export function clearContentfulContentCache(locale?: LocaleKey) {
  clearSharedContentfulContentCache(locale);
}
