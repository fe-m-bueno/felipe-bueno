export type LocaleKey = "en" | "pt";

export type ProjectContent = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  github: string;
  techs: { name: string; icon: string }[];
  metrics: string[];
};

export type AboutContent = {
  title: string;
  description: string;
  availability: {
    status: string;
    types: string[];
    locations: string[];
    timezone: string;
    overlap: string;
  };
  tldr: string[];
};

export type ResumeContent = {
  experience: {
    company: string;
    role: string;
    date: string;
    description: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    date: string;
  }[];
  additionalEducation: {
    institution: string;
    degree: string;
    date: string;
  }[];
  pdf: string;
};

export type ContentfulSiteContent = {
  locale: LocaleKey;
  projects: ProjectContent[];
  about: AboutContent | null;
  resume: ResumeContent;
  uiCopy: Record<string, unknown>;
};

const contentfulLocaleByAppLocale: Record<LocaleKey, string> = {
  en: "en-US",
  pt: "pt-BR",
};

type ContentfulSys = {
  id: string;
  type: string;
  contentType?: {
    sys: {
      id: string;
    };
  };
};

type ContentfulResource = {
  sys: ContentfulSys;
  fields: Record<string, unknown>;
};

type ContentfulCollection = {
  items: ContentfulResource[];
  includes?: {
    Entry?: ContentfulResource[];
    Asset?: ContentfulResource[];
  };
};

type ResolvedContentfulEntry = ContentfulResource & {
  fields: Record<string, unknown>;
};

type LinkObject = {
  sys: {
    type: "Link";
    linkType: "Entry" | "Asset";
    id: string;
  };
};

function getConfig() {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_DELIVERY_TOKEN;
  const environment = process.env.CONTENTFUL_ENVIRONMENT_ID || "master";

  if (!space || !accessToken) {
    throw new Error("Missing Contentful delivery configuration.");
  }

  return { space, accessToken, environment };
}

function getFields(entry: ResolvedContentfulEntry | undefined): Record<string, unknown> {
  return (entry?.fields || {}) as Record<string, unknown>;
}

function getAssetUrl(asset: unknown): string {
  const fields = (asset as ResolvedContentfulEntry | undefined)?.fields;
  const file = fields?.file as { url?: unknown } | undefined;
  const url = file?.url;

  if (typeof url !== "string") {
    return "";
  }

  return url.startsWith("//") ? `https:${url}` : url;
}

function getAssetPath(asset: unknown): string {
  const url = getAssetUrl(asset);
  return url || "";
}

function getAssetTitle(asset: unknown): string {
  const fields = (asset as ResolvedContentfulEntry | undefined)?.fields;
  return typeof fields?.title === "string" ? fields.title : "";
}

function getString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function getNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" ? value : fallback;
}

function getStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function setNestedValue(target: Record<string, unknown>, key: string, value: string) {
  const parts = key.split(".");
  let current = target;

  for (const part of parts.slice(0, -1)) {
    const existing = current[part];
    if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }

  current[parts[parts.length - 1]] = value;
}

function isLink(value: unknown): value is LinkObject {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    (value as LinkObject).sys?.type === "Link" &&
    typeof (value as LinkObject).sys?.id === "string"
  );
}

function resolveFieldValue(
  value: unknown,
  entriesById: Map<string, ContentfulResource>,
  assetsById: Map<string, ContentfulResource>,
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => resolveFieldValue(item, entriesById, assetsById));
  }

  if (isLink(value)) {
    return value.sys.linkType === "Asset"
      ? assetsById.get(value.sys.id) || value
      : entriesById.get(value.sys.id) || value;
  }

  return value;
}

function resolveCollection(collection: ContentfulCollection): ResolvedContentfulEntry[] {
  const entriesById = new Map(
    (collection.includes?.Entry || []).map((entry) => [entry.sys.id, entry]),
  );
  const assetsById = new Map(
    (collection.includes?.Asset || []).map((asset) => [asset.sys.id, asset]),
  );

  return collection.items.map((item) => ({
    ...item,
    fields: Object.fromEntries(
      Object.entries(item.fields).map(([key, value]) => [
        key,
        resolveFieldValue(value, entriesById, assetsById),
      ]),
    ),
  }));
}

function mapTechnology(entry: unknown) {
  const fields = getFields(entry as ResolvedContentfulEntry);
  return {
    name: getString(fields.name),
    icon: getString(fields.icon),
  };
}

function mapProject(entry: ResolvedContentfulEntry): ProjectContent {
  const fields = getFields(entry);
  const image = getAssetPath(fields.image);

  return {
    id: entry.sys.id.replace(/^project-/, ""),
    title: getString(fields.title),
    description: getString(fields.description),
    image,
    link: getString(fields.liveUrl, "#"),
    github: getString(fields.githubUrl, "#"),
    techs: Array.isArray(fields.technologies) ? fields.technologies.map(mapTechnology) : [],
    metrics: getStringArray(fields.metrics),
  };
}

function mapAbout(entry: ResolvedContentfulEntry | undefined): AboutContent | null {
  if (!entry) {
    return null;
  }

  const fields = getFields(entry);

  return {
    title: getString(fields.aboutTitle),
    description: getString(fields.aboutDescription),
    availability: {
      status: getString(fields.availabilityStatus),
      types: getStringArray(fields.availabilityTypes),
      locations: getStringArray(fields.availabilityLocations),
      timezone: getString(fields.availabilityTimezone),
      overlap: getString(fields.availabilityOverlap),
    },
    tldr: getStringArray(fields.tldr),
  };
}

function mapResumeExperience(entry: ResolvedContentfulEntry) {
  const fields = getFields(entry);
  return {
    company: getString(fields.company),
    role: getString(fields.role),
    date: getString(fields.dateLabel),
    description: getStringArray(fields.description),
    order: getNumber(fields.order),
  };
}

function mapEducation(entry: ResolvedContentfulEntry) {
  const fields = getFields(entry);
  return {
    institution: getString(fields.institution),
    degree: getString(fields.degree),
    date: getString(fields.dateLabel),
    kind: getString(fields.kind),
    order: getNumber(fields.order),
  };
}

function mapUiCopy(entries: ResolvedContentfulEntry[]) {
  const uiCopy: Record<string, unknown> = {};

  for (const entry of entries) {
    const fields = getFields(entry);
    const key = getString(fields.key);
    const value = getString(fields.value);

    if (key) {
      setNestedValue(uiCopy, key, value);
    }
  }

  return uiCopy;
}

export async function getContentfulSiteContent(locale: LocaleKey): Promise<ContentfulSiteContent> {
  const { space, accessToken, environment } = getConfig();
  const contentfulLocale = contentfulLocaleByAppLocale[locale];
  const baseUrl = `https://cdn.contentful.com/spaces/${space}/environments/${environment}/entries`;

  async function getEntries(params: Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      access_token: accessToken,
      locale: contentfulLocale,
      ...Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)]),
      ),
    });
    const response = await fetch(`${baseUrl}?${searchParams.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Contentful Delivery API request failed: ${response.status}`);
    }

    return resolveCollection((await response.json()) as ContentfulCollection);
  }

  const [projectEntries, siteProfileEntries, experienceEntries, educationEntries, uiCopyEntries] =
    await Promise.all([
      getEntries({
        content_type: "project",
        include: 2,
        order: "fields.order",
        limit: 100,
      }),
      getEntries({
        content_type: "siteProfile",
        include: 2,
        limit: 1,
      }),
      getEntries({
        content_type: "resumeExperience",
        order: "fields.order",
        limit: 100,
      }),
      getEntries({
        content_type: "education",
        order: "fields.kind,fields.order",
        limit: 100,
      }),
      getEntries({
        content_type: "uiCopy",
        limit: 200,
      }),
    ]);

  const siteProfile = siteProfileEntries[0];
  const siteProfileFields = getFields(siteProfile);
  const experiences = experienceEntries.map(mapResumeExperience).sort((a, b) => a.order - b.order);
  const educationItems = educationEntries.map(mapEducation).sort((a, b) => a.order - b.order);

  return {
    locale,
    projects: projectEntries.map(mapProject),
    about: mapAbout(siteProfile),
    resume: {
      experience: experiences.map(({ order: _order, ...experience }) => experience),
      education: educationItems
        .filter((item) => item.kind === "education")
        .map(({ kind: _kind, order: _order, ...education }) => education),
      additionalEducation: educationItems
        .filter((item) => item.kind === "additionalEducation")
        .map(({ kind: _kind, order: _order, ...education }) => education),
      pdf: getAssetUrl(siteProfileFields.resumePdf) || getAssetTitle(siteProfileFields.resumePdf),
    },
    uiCopy: mapUiCopy(uiCopyEntries),
  };
}
