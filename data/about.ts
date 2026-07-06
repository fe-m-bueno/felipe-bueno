const placeholderAvailability = {
  status: "Content moved to Contentful",
  types: ["Headless CMS"],
  locations: ["Contentful"],
  timezone: "Contentful",
  overlap: "Contentful",
};

export const about = {
  en: {
    title: "Content moved to Contentful",
    description: "This placeholder keeps the app renderable while Contentful fetching is wired in.",
    availability: placeholderAvailability,
    tldr: ["Contentful is now the source of truth"],
  },
  pt: {
    title: "Conteudo movido para o Contentful",
    description:
      "Este placeholder mantem o app renderizavel enquanto a leitura do Contentful e conectada.",
    availability: {
      ...placeholderAvailability,
      status: "Conteudo movido para o Contentful",
    },
    tldr: ["O Contentful agora e a fonte da verdade"],
  },
};
