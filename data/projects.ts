const placeholderTech = { name: "Contentful", icon: "simple-icons:contentful" };

const placeholderProject = {
  id: "contentful-placeholder",
  title: "Content moved to Contentful",
  description: "This placeholder keeps the app renderable while Contentful fetching is wired in.",
  image: "/felipe-bueno.png",
  link: "#",
  github: "#",
  techs: [placeholderTech],
  metrics: ["Headless CMS"],
};

export const projects = {
  en: [placeholderProject],
  pt: [
    {
      ...placeholderProject,
      title: "Conteudo movido para o Contentful",
      description:
        "Este placeholder mantem o app renderizavel enquanto a leitura do Contentful e conectada.",
      metrics: ["Headless CMS"],
    },
  ],
};
