const imageAssetValidation = [{ linkMimetypeGroup: ["image"] }];
const requiredImageAssetValidation = [{ linkMimetypeGroup: ["image"] }];
const projectStatusValues = ["featured", "published", "archived"];
const blogStatusValues = ["draft", "published", "archived"];
const technologyCategories = ["framework", "library", "language", "database", "api", "tool", "platform", "ai"];

function symbolField(contentType, id, name, { required = false, localized = false, validations = [] } = {}) {
  return contentType
    .createField(id)
    .name(name)
    .type("Symbol")
    .required(required)
    .localized(localized)
    .validations(validations);
}

function textField(contentType, id, name, { required = false, localized = false, validations = [] } = {}) {
  return contentType
    .createField(id)
    .name(name)
    .type("Text")
    .required(required)
    .localized(localized)
    .validations(validations);
}

function integerField(contentType, id, name, { required = false, validations = [] } = {}) {
  return contentType.createField(id).name(name).type("Integer").required(required).validations(validations);
}

function booleanField(contentType, id, name) {
  return contentType.createField(id).name(name).type("Boolean");
}

function assetField(contentType, id, name, { required = false, localized = false, validations = imageAssetValidation } = {}) {
  return contentType
    .createField(id)
    .name(name)
    .type("Link")
    .linkType("Asset")
    .required(required)
    .localized(localized)
    .validations(validations);
}

function entryField(contentType, id, name, linkedContentTypes, { required = false } = {}) {
  return contentType
    .createField(id)
    .name(name)
    .type("Link")
    .linkType("Entry")
    .required(required)
    .validations([{ linkContentType: linkedContentTypes }]);
}

function symbolArrayField(contentType, id, name, { required = false, localized = false } = {}) {
  return contentType
    .createField(id)
    .name(name)
    .type("Array")
    .required(required)
    .localized(localized)
    .items({ type: "Symbol" });
}

function entryArrayField(contentType, id, name, linkedContentTypes, { required = false } = {}) {
  return contentType
    .createField(id)
    .name(name)
    .type("Array")
    .required(required)
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [{ linkContentType: linkedContentTypes }],
    });
}

function assetArrayField(contentType, id, name) {
  return contentType
    .createField(id)
    .name(name)
    .type("Array")
    .items({
      type: "Link",
      linkType: "Asset",
      validations: imageAssetValidation,
    });
}

module.exports = function (migration) {
  const technology = migration.createContentType("technology", {
    name: "Technology",
    description: "Reusable technology badge used by projects and blog posts.",
    displayField: "name",
  });
  symbolField(technology, "key", "Key", { required: true, validations: [{ unique: true }] });
  symbolField(technology, "name", "Name", { required: true });
  symbolField(technology, "icon", "Iconify icon");
  symbolField(technology, "category", "Category", {
    validations: [{ in: technologyCategories }],
  });

  const project = migration.createContentType("project", {
    name: "Project",
    description: "Portfolio project with localized copy and reusable technology references.",
    displayField: "internalName",
  });
  symbolField(project, "internalName", "Internal name", { required: true });
  symbolField(project, "slug", "Slug", { required: true, localized: true });
  symbolField(project, "title", "Title", { required: true, localized: true });
  textField(project, "description", "Description", { required: true, localized: true });
  assetField(project, "image", "Image", { required: true, validations: requiredImageAssetValidation });
  symbolField(project, "liveUrl", "Live URL");
  symbolField(project, "githubUrl", "GitHub URL");
  entryArrayField(project, "technologies", "Technologies", ["technology"]);
  symbolArrayField(project, "metrics", "Metrics", { localized: true });
  booleanField(project, "featured", "Featured");
  integerField(project, "order", "Order");
  symbolField(project, "status", "Status", {
    required: true,
    validations: [{ in: projectStatusValues }],
  });

  const siteProfile = migration.createContentType("siteProfile", {
    name: "Site profile",
    description: "Singleton entry for homepage, about, availability, and resume assets.",
    displayField: "internalName",
  });
  symbolField(siteProfile, "internalName", "Internal name", { required: true });
  symbolField(siteProfile, "heroTitle", "Hero title", { required: true, localized: true });
  textField(siteProfile, "heroDescription", "Hero description", { required: true, localized: true });
  textField(siteProfile, "heroSecondaryDescription", "Hero secondary description", { localized: true });
  symbolField(siteProfile, "aboutTitle", "About title", { required: true, localized: true });
  textField(siteProfile, "aboutDescription", "About description", { required: true, localized: true });
  symbolField(siteProfile, "availabilityStatus", "Availability status", { localized: true });
  symbolArrayField(siteProfile, "availabilityTypes", "Availability types", { localized: true });
  symbolArrayField(siteProfile, "availabilityLocations", "Availability locations", { localized: true });
  symbolField(siteProfile, "availabilityTimezone", "Availability timezone", { localized: true });
  symbolField(siteProfile, "availabilityOverlap", "Availability overlap", { localized: true });
  symbolArrayField(siteProfile, "tldr", "TL;DR bullets", { localized: true });
  assetField(siteProfile, "profileImage", "Profile image");
  assetField(siteProfile, "heroImage", "Hero image");
  assetField(siteProfile, "resumePdf", "Resume PDF", { localized: true, validations: [] });

  const resumeExperience = migration.createContentType("resumeExperience", {
    name: "Resume experience",
    description: "Work history item rendered in the resume section.",
    displayField: "company",
  });
  symbolField(resumeExperience, "company", "Company", { required: true });
  symbolField(resumeExperience, "role", "Role", { required: true, localized: true });
  symbolField(resumeExperience, "dateLabel", "Date label", { required: true, localized: true });
  symbolArrayField(resumeExperience, "description", "Description bullets", {
    required: true,
    localized: true,
  });
  integerField(resumeExperience, "order", "Order", { required: true });

  const education = migration.createContentType("education", {
    name: "Education",
    description: "Education and additional education item rendered in the resume section.",
    displayField: "institution",
  });
  symbolField(education, "institution", "Institution", { required: true, localized: true });
  symbolField(education, "degree", "Degree", { required: true, localized: true });
  symbolField(education, "dateLabel", "Date label", { required: true, localized: true });
  symbolField(education, "kind", "Kind", {
    required: true,
    validations: [{ in: ["education", "additionalEducation"] }],
  });
  integerField(education, "order", "Order", { required: true });

  const uiCopy = migration.createContentType("uiCopy", {
    name: "UI copy",
    description: "Localized labels currently stored in locales/*.json.",
    displayField: "key",
  });
  symbolField(uiCopy, "key", "Key", { required: true, validations: [{ unique: true }] });
  textField(uiCopy, "value", "Value", { required: true, localized: true });
  symbolField(uiCopy, "group", "Group");

  const blogCategory = migration.createContentType("blogCategory", {
    name: "Blog category",
    description: "Localized category for blog posts.",
    displayField: "title",
  });
  symbolField(blogCategory, "title", "Title", { required: true, localized: true });
  symbolField(blogCategory, "slug", "Slug", { required: true, localized: true });
  textField(blogCategory, "description", "Description", { localized: true });

  const blogPost = migration.createContentType("blogPost", {
    name: "Blog post",
    description: "Localized article with cover image, inline rich-text media, gallery, SEO, and categories.",
    displayField: "internalTitle",
  });
  symbolField(blogPost, "internalTitle", "Internal title", { required: true });
  symbolField(blogPost, "title", "Title", { required: true, localized: true });
  symbolField(blogPost, "slug", "Slug", { required: true, localized: true });
  textField(blogPost, "excerpt", "Excerpt", { required: true, localized: true });
  blogPost
    .createField("body")
    .name("Body")
    .type("RichText")
    .required(true)
    .localized(true)
    .validations([
      {
        enabledNodeTypes: [
          "heading-2",
          "heading-3",
          "heading-4",
          "ordered-list",
          "unordered-list",
          "blockquote",
          "hr",
          "hyperlink",
          "entry-hyperlink",
          "asset-hyperlink",
          "embedded-entry-block",
          "embedded-asset-block",
          "embedded-entry-inline",
        ],
      },
      {
        enabledMarks: ["bold", "italic", "underline", "code"],
      },
    ]);
  assetField(blogPost, "coverImage", "Cover image", { required: true, validations: requiredImageAssetValidation });
  symbolField(blogPost, "coverImageAlt", "Cover image alt text", { localized: true });
  assetArrayField(blogPost, "gallery", "Image gallery");
  entryArrayField(blogPost, "categories", "Categories", ["blogCategory"]);
  entryArrayField(blogPost, "technologies", "Technologies", ["technology"]);
  blogPost.createField("publishedAt").name("Published at").type("Date");
  blogPost.createField("updatedAt").name("Updated at").type("Date");
  integerField(blogPost, "readingTimeMinutes", "Reading time in minutes");
  booleanField(blogPost, "featured", "Featured");
  symbolField(blogPost, "status", "Status", {
    required: true,
    validations: [{ in: blogStatusValues }],
  });
  symbolField(blogPost, "seoTitle", "SEO title", { localized: true });
  textField(blogPost, "seoDescription", "SEO description", { localized: true });
};
