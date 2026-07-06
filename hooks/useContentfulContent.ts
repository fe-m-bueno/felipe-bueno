"use client";

import { useEffect, useState } from "react";
import type { ContentfulSiteContent, LocaleKey } from "@/lib/contentfulContent";
import { about } from "@/data/about";
import { projects } from "@/data/projects";
import { resume } from "@/data/resume";

const cache = new Map<LocaleKey, ContentfulSiteContent>();

function fallbackContent(locale: LocaleKey): ContentfulSiteContent {
  return {
    locale,
    projects: projects[locale] || projects.en,
    about: about[locale] || about.en,
    resume: resume[locale] || resume.en,
    uiCopy: {},
  };
}

export function useContentfulContent(locale: LocaleKey) {
  const [content, setContent] = useState<ContentfulSiteContent>(() => cache.get(locale) || fallbackContent(locale));
  const [isLoading, setIsLoading] = useState(!cache.has(locale));

  useEffect(() => {
    let cancelled = false;
    const cached = cache.get(locale);

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

    fetch(`/api/content?locale=${locale}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch Contentful content");
        }
        return response.json() as Promise<ContentfulSiteContent>;
      })
      .then((nextContent) => {
        cache.set(locale, nextContent);
        if (!cancelled) {
          setContent(nextContent);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setContent(fallbackContent(locale));
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
  if (locale) {
    cache.delete(locale);
    return;
  }

  cache.clear();
}
