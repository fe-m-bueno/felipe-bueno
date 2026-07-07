"use client";

import type { ContentfulSiteContent, LocaleKey } from "@/lib/contentfulContent";
import { about } from "@/data/about";
import { projects } from "@/data/projects";
import { resume } from "@/data/resume";

const contentCache = new Map<LocaleKey, ContentfulSiteContent>();
const pendingContentRequests = new Map<LocaleKey, Promise<ContentfulSiteContent>>();

export function normalizeContentfulLocale(language: string): LocaleKey {
  return language.toLowerCase().startsWith("pt") ? "pt" : "en";
}

export function getFallbackContent(locale: LocaleKey): ContentfulSiteContent {
  return {
    locale,
    projects: projects[locale] || projects.en,
    about: about[locale] || about.en,
    resume: resume[locale] || resume.en,
    uiCopy: {},
  };
}

export function getCachedContentfulContent(locale: LocaleKey) {
  return contentCache.get(locale);
}

export function prefetchContentfulContent(locale: LocaleKey) {
  const cached = contentCache.get(locale);
  if (cached) {
    return Promise.resolve(cached);
  }

  const pendingRequest = pendingContentRequests.get(locale);
  if (pendingRequest) {
    return pendingRequest;
  }

  const request = fetch(`/api/content?locale=${locale}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch Contentful content");
      }

      return response.json() as Promise<ContentfulSiteContent>;
    })
    .then((content) => {
      contentCache.set(locale, content);
      return content;
    })
    .finally(() => {
      pendingContentRequests.delete(locale);
    });

  pendingContentRequests.set(locale, request);
  return request;
}

export function prefetchOtherContentfulLocale(locale: LocaleKey) {
  const otherLocale: LocaleKey = locale === "pt" ? "en" : "pt";

  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(() => {
      void prefetchContentfulContent(otherLocale).catch(() => undefined);
    });
    return;
  }

  globalThis.setTimeout(() => {
    void prefetchContentfulContent(otherLocale).catch(() => undefined);
  }, 0);
}

export function clearContentfulContentCache(locale?: LocaleKey) {
  if (locale) {
    contentCache.delete(locale);
    pendingContentRequests.delete(locale);
    return;
  }

  contentCache.clear();
  pendingContentRequests.clear();
}
