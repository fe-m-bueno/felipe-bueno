import { about } from "@/data/about";
import { projects } from "@/data/projects";
import { resume } from "@/data/resume";
import {
  getContentfulSiteContent,
  type ContentfulSiteContent,
} from "@/lib/contentfulContent";
import type { LocaleKey } from "@/lib/locale";

export function getFallbackContent(locale: LocaleKey): ContentfulSiteContent {
  return {
    locale,
    projects: projects[locale] || projects.en,
    about: about[locale] || about.en,
    resume: resume[locale] || resume.en,
    skills: [],
    uiCopy: {},
  };
}

export async function getSiteContent(locale: LocaleKey): Promise<ContentfulSiteContent> {
  try {
    return await getContentfulSiteContent(locale);
  } catch (error) {
    console.error("Failed to load Contentful content, serving bundled copy", error);
    return getFallbackContent(locale);
  }
}
