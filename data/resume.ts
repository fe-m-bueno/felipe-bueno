const placeholderExperience = {
  company: "Contentful",
  role: "Content moved to Contentful",
  date: "Contentful",
  description: ["This placeholder keeps the app renderable while Contentful fetching is wired in."],
};

const placeholderEducation = {
  institution: "Contentful",
  degree: "Content moved to Contentful",
  date: "Contentful",
};

export const resume = {
  en: {
    experience: [placeholderExperience],
    education: [placeholderEducation],
    additionalEducation: [placeholderEducation],
    pdf: "/pdfs/resume_2026_en.pdf",
  },
  pt: {
    experience: [
      {
        ...placeholderExperience,
        role: "Conteudo movido para o Contentful",
        description: [
          "Este placeholder mantem o app renderizavel enquanto a leitura do Contentful e conectada.",
        ],
      },
    ],
    education: [
      {
        ...placeholderEducation,
        degree: "Conteudo movido para o Contentful",
      },
    ],
    additionalEducation: [
      {
        ...placeholderEducation,
        degree: "Conteudo movido para o Contentful",
      },
    ],
    pdf: "/pdfs/resume_2026_pt.pdf",
  },
};
