const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const contentful = require("contentful-management");

const ROOT = path.resolve(__dirname, "..");
const EN = "en-US";
const PT = "pt-BR";
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT_ID || "master";

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken =
  process.env.CONTENTFUL_MANAGEMENT_TOKEN ||
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN ||
  process.env.CONTENTFUL_CMA_TOKEN;

if (!spaceId) {
  throw new Error("CONTENTFUL_SPACE_ID is required.");
}

function loadTsModule(relativePath) {
  const filename = path.join(ROOT, relativePath);
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filename,
  }).outputText;

  const compiledModule = { exports: {} };
  const context = vm.createContext({
    module: compiledModule,
    exports: compiledModule.exports,
    require,
    console,
    Date,
  });
  vm.runInContext(output, context, { filename });
  return compiledModule.exports;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function idSafe(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function localized(en, pt) {
  return { [EN]: en, [PT]: pt };
}

function link(linkType, id) {
  return { sys: { type: "Link", linkType, id } };
}

function entryLink(id) {
  return link("Entry", id);
}

function assetLink(id) {
  return link("Asset", id);
}

function flattenCopy(object, prefix = "") {
  return Object.entries(object).flatMap(([key, value]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return flattenCopy(value, nextKey);
    }
    return [[nextKey, String(value)]];
  });
}

async function getExistingEntry(client, entryId) {
  try {
    return await client.entry.get({ spaceId, environmentId: ENVIRONMENT_ID, entryId });
  } catch (error) {
    if (error?.name === "NotFound" || error?.status === 404 || error?.statusText === "Not Found") {
      return null;
    }
    throw error;
  }
}

async function upsertEntry(client, contentType, entryId, fields) {
  const existing = await getExistingEntry(client, entryId);
  const params = { spaceId, environmentId: ENVIRONMENT_ID, entryId };
  let entry;

  if (existing) {
    entry = await client.entry.update(params, { ...existing, fields });
  } else {
    entry = await client.entry.createWithId(
      { ...params, contentTypeId: contentType },
      { fields },
    );
  }

  if (!entry.sys.publishedVersion || entry.sys.version > entry.sys.publishedVersion + 1) {
    entry = await client.entry.publish(params, entry);
  }

  return entry;
}

async function getExistingAsset(client, assetId) {
  try {
    return await client.asset.get({ spaceId, environmentId: ENVIRONMENT_ID, assetId });
  } catch (error) {
    if (error?.name === "NotFound" || error?.status === 404 || error?.statusText === "Not Found") {
      return null;
    }
    throw error;
  }
}

async function uploadAsset(client, assetId, publicPath, title) {
  const relativePath = publicPath.startsWith("/") ? publicPath.slice(1) : publicPath;
  const filePath = path.join(ROOT, "public", relativePath);
  const fileName = path.basename(filePath);
  const extension = path.extname(fileName).toLowerCase();
  const contentType =
    extension === ".pdf"
      ? "application/pdf"
      : extension === ".png"
        ? "image/png"
        : extension === ".jpg" || extension === ".jpeg"
          ? "image/jpeg"
          : "image/webp";

  if (!fs.existsSync(filePath)) {
    throw new Error(`Asset file not found: ${publicPath}`);
  }

  const existing = await getExistingAsset(client, assetId);
  if (existing?.sys.publishedVersion) {
    return existing;
  }

  let asset;
  if (existing) {
    asset = existing;
  } else {
    const upload = await client.upload.create(
      { spaceId, environmentId: ENVIRONMENT_ID },
      { file: fs.createReadStream(filePath) },
    );

    asset = await client.asset.createWithId(
      { spaceId, environmentId: ENVIRONMENT_ID, assetId },
      {
        fields: {
          title: { [EN]: title },
          file: {
            [EN]: {
              contentType,
              fileName,
              uploadFrom: link("Upload", upload.sys.id),
            },
          },
        },
      },
    );

    asset = await client.asset.processForAllLocales(
      { spaceId, environmentId: ENVIRONMENT_ID },
      asset,
    );
  }

  if (!asset.sys.publishedVersion) {
    asset = await client.asset.publish({ spaceId, environmentId: ENVIRONMENT_ID, assetId }, asset);
  }

  return asset;
}

async function ensurePortugueseLocale(client) {
  const locales = await client.locale.getMany({ spaceId, environmentId: ENVIRONMENT_ID });
  const exists = locales.items.some((locale) => locale.code === PT);

  if (exists) {
    return;
  }

  await client.locale.create(
    { spaceId, environmentId: ENVIRONMENT_ID },
    {
      name: "Portuguese (Brazil)",
      code: PT,
      fallbackCode: EN,
      optional: false,
    },
  );
}

async function main() {
  const client = contentful.createClient(
    accessToken ? { accessToken } : {},
    { type: "plain" },
  );

  const { projects } = loadTsModule("data/projects.ts");
  const { about } = loadTsModule("data/about.ts");
  const { resume } = loadTsModule("data/resume.ts");
  const enCopy = readJson("locales/en/translation.json");
  const ptCopy = readJson("locales/pt/translation.json");

  await ensurePortugueseLocale(client);

  const allProjects = projects.en.map((project, index) => {
    const ptProject = projects.pt.find((candidate) => candidate.id === project.id);
    if (!ptProject) {
      throw new Error(`Missing Portuguese project for ${project.id}`);
    }
    return { en: project, pt: ptProject, order: index + 1 };
  });

  const technologyByName = new Map();
  for (const project of [...projects.en, ...projects.pt]) {
    for (const tech of project.techs) {
      technologyByName.set(tech.name, tech);
    }
  }

  for (const tech of technologyByName.values()) {
    await upsertEntry(client, "technology", `technology-${idSafe(tech.name)}`, {
      key: { [EN]: idSafe(tech.name) },
      name: { [EN]: tech.name },
      icon: { [EN]: tech.icon },
      category: { [EN]: "tool" },
    });
  }

  const assetIdsByPath = new Map();
  async function ensureAsset(publicPath, title) {
    const assetId = `asset-${idSafe(publicPath)}`;
    if (!assetIdsByPath.has(publicPath)) {
      await uploadAsset(client, assetId, publicPath, title);
      assetIdsByPath.set(publicPath, assetId);
    }
    return assetIdsByPath.get(publicPath);
  }

  for (const project of allProjects) {
    const imageId = await ensureAsset(project.en.image, project.en.title);
    await upsertEntry(client, "project", `project-${project.en.id}`, {
      internalName: { [EN]: project.en.title },
      slug: localized(project.en.id, project.pt.id),
      title: localized(project.en.title, project.pt.title),
      description: localized(project.en.description, project.pt.description),
      image: { [EN]: assetLink(imageId) },
      liveUrl: { [EN]: project.en.link },
      githubUrl: { [EN]: project.en.github },
      technologies: {
        [EN]: project.en.techs.map((tech) => entryLink(`technology-${idSafe(tech.name)}`)),
      },
      metrics: localized(project.en.metrics, project.pt.metrics),
      featured: { [EN]: project.order <= 4 },
      order: { [EN]: project.order },
      status: { [EN]: project.order <= 4 ? "featured" : "published" },
    });
  }

  const profileImageId = await ensureAsset("/felipe-bueno.png", "Felipe Bueno profile image");
  const heroImageId = await ensureAsset("/hero.jpg", "Felipe Bueno hero image");
  const resumeEnPdfId = await ensureAsset(resume.en.pdf, "Felipe Bueno resume English");
  const resumePtPdfId = await ensureAsset(resume.pt.pdf, "Felipe Bueno resume Portuguese");

  await upsertEntry(client, "siteProfile", "site-profile-main", {
    internalName: { [EN]: "Main site profile" },
    heroTitle: localized(enCopy.hero.title, ptCopy.hero.title),
    heroDescription: localized(enCopy.hero.description, ptCopy.hero.description),
    heroSecondaryDescription: localized(enCopy.hero.description2, ptCopy.hero.description2),
    aboutTitle: localized(about.en.title, about.pt.title),
    aboutDescription: localized(about.en.description, about.pt.description),
    availabilityStatus: localized(about.en.availability.status, about.pt.availability.status),
    availabilityTypes: localized(about.en.availability.types, about.pt.availability.types),
    availabilityLocations: localized(about.en.availability.locations, about.pt.availability.locations),
    availabilityTimezone: localized(about.en.availability.timezone, about.pt.availability.timezone),
    availabilityOverlap: localized(about.en.availability.overlap, about.pt.availability.overlap),
    tldr: localized(about.en.tldr, about.pt.tldr),
    profileImage: { [EN]: assetLink(profileImageId) },
    heroImage: { [EN]: assetLink(heroImageId) },
    resumePdf: localized(assetLink(resumeEnPdfId), assetLink(resumePtPdfId)),
  });

  for (const [index, experience] of resume.en.experience.entries()) {
    const ptExperience = resume.pt.experience[index];
    const descriptionEn = Array.isArray(experience.description)
      ? experience.description
      : [experience.description];
    const descriptionPt = Array.isArray(ptExperience.description)
      ? ptExperience.description
      : [ptExperience.description];

    await upsertEntry(client, "resumeExperience", `resume-experience-${index + 1}`, {
      company: { [EN]: experience.company },
      role: localized(experience.role, ptExperience.role),
      dateLabel: localized(experience.date, ptExperience.date),
      description: localized(descriptionEn, descriptionPt),
      order: { [EN]: index + 1 },
    });
  }

  const educationItems = [
    ...resume.en.education.map((item, index) => ({ item, ptItem: resume.pt.education[index], kind: "education", order: index + 1 })),
    ...resume.en.additionalEducation.map((item, index) => ({
      item,
      ptItem: resume.pt.additionalEducation[index],
      kind: "additionalEducation",
      order: index + 1,
    })),
  ];

  for (const education of educationItems) {
    await upsertEntry(client, "education", `${education.kind}-${education.order}`, {
      institution: localized(education.item.institution, education.ptItem.institution),
      degree: localized(education.item.degree, education.ptItem.degree),
      dateLabel: localized(education.item.date, education.ptItem.date),
      kind: { [EN]: education.kind },
      order: { [EN]: education.order },
    });
  }

  const enEntries = new Map(flattenCopy(enCopy));
  const ptEntries = new Map(flattenCopy(ptCopy));

  for (const [key, enValue] of enEntries) {
    await upsertEntry(client, "uiCopy", `ui-copy-${idSafe(key)}`, {
      key: { [EN]: key },
      value: localized(enValue, ptEntries.get(key) || enValue),
      group: { [EN]: key.split(".")[0] },
    });
  }

  await upsertEntry(client, "blogCategory", "blog-category-engineering", {
    title: localized("Engineering", "Engenharia"),
    slug: localized("engineering", "engenharia"),
    description: localized("Notes about software engineering.", "Notas sobre engenharia de software."),
  });

  console.log("Contentful seed completed.");
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exitCode = 1;
});
