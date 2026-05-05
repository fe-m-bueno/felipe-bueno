const calculateAge = () => {
  const birthDate = new Date(2001, 7, 30);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const isBeforeBirthday =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate());

  return isBeforeBirthday ? age - 1 : age;
};

export const about = {
  en: {
    title: "About Me",
    description: `I am ${calculateAge()} years old with a degree in Business Administration and currently pursuing Systems Analysis and Development at PUCPR. My strongest work sits at the intersection of backend engineering, internal platforms, data pipelines, and performance optimization.

Currently working as a Junior Systems Analyst at Pilgrims Consulting, I maintain Django platforms, build REST APIs, optimize SQL-heavy workflows, and orchestrate Apache Airflow pipelines that support real business operations. Recent wins include reducing a production search from 92s to 3.6s, cutting dashboard runtimes from 29s to 1.2s, and saving 240+ hours through automation.

I work mainly with Python, Django, TypeScript, PostgreSQL, Airflow, Docker, Redis, and API integrations. I also bring a business background and multilingual communication in Portuguese, English, and Spanish, which helps me turn messy operational problems into software that people can actually use.`,
    availability: {
      status: "Open to opportunities",
      types: ["Full-time", "Contract", "Remote"],
      locations: ["Brazil", "Remote Worldwide"],
      timezone: "GMT-3 (Brazil)",
      overlap: "Available 9 AM - 6 PM EST",
    },
    tldr: [
      `${calculateAge()} years old`,
      "Curitiba, Brazil",
      "Fullstack Developer · Backend-focused",
      "99.7% query optimization in production",
      "140 Airflow DAGs orchestrated",
      "240+ hours saved via automation",
      "Django · TypeScript · PostgreSQL · Airflow · Docker",
      "English · Portuguese · Spanish",
    ],
  },

  pt: {
    title: "Sobre Mim",
    description: `Tenho ${calculateAge()} anos, sou formado em Administração e atualmente curso Análise e Desenvolvimento de Sistemas na PUCPR. Meu trabalho mais forte está na interseção entre engenharia backend, plataformas internas, pipelines de dados e otimização de performance.

Atualmente trabalho como Analista de Sistemas Júnior na Pilgrims Consulting, mantendo plataformas em Django, construindo APIs REST, otimizando fluxos pesados em SQL e orquestrando pipelines no Apache Airflow que apoiam operações reais do negócio. Entre os principais resultados recentes estão a redução de uma busca em produção de 92s para 3,6s, dashboards de 29s para 1,2s e 240+ horas economizadas com automações.

Trabalho principalmente com Python, Django, TypeScript, PostgreSQL, Airflow, Docker, Redis e integrações com APIs. Também trago formação em negócios e comunicação multilíngue em português, inglês e espanhol, o que me ajuda a transformar problemas operacionais bagunçados em software que as pessoas realmente usam.`,
    availability: {
      status: "Aberto a oportunidades",
      types: ["Tempo integral", "Contrato", "Remoto"],
      locations: ["Brasil", "Remoto Internacional"],
      timezone: "GMT-3 (Brasil)",
      overlap: "Disponível 9h - 18h horário de Brasília",
    },
    tldr: [
      `${calculateAge()} anos`,
      "Curitiba, Brasil",
      "Desenvolvedor Fullstack · Foco em Backend",
      "99,7% de otimização de queries em produção",
      "140 DAGs do Airflow orquestradas",
      "240+ horas economizadas via automação",
      "Django · TypeScript · PostgreSQL · Airflow · Docker",
      "Inglês · Português · Espanhol",
    ],
  },
};
