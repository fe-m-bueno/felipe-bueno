const techs = {
  Next: { name: "Next.js", icon: "ri:nextjs-fill" },
  React: { name: "React", icon: "mdi:react" },
  Tailwind: { name: "Tailwind CSS", icon: "mdi:tailwind" },
  TypeScript: { name: "TypeScript", icon: "bxl:typescript" },
  Nuxt: { name: "Nuxt.js", icon: "lineicons:nuxt" },
  Vue: { name: "Vue", icon: "mdi:vuejs" },
  Groq: { name: "Groq", icon: "mdi:groq" },
  Pinia: { name: "Pinia", icon: "logos:pinia" },
  Svelte: { name: "Svelte", icon: "ri:svelte-fill" },
  SvelteKit: { name: "SvelteKit", icon: "ri:svelte-fill" },
  WeatherAPI: { name: "Weather API", icon: "fluent:weather-rain-20-filled" },
  Gemini: { name: "Gemini AI", icon: "simple-icons:googlegemini" },
};

export const projects = {
  en: [
    {
      id: "1",
      title: "Lederboxed",
      description:
        "A web app to explore 500K+ movies and TV shows using TMDB API. Features server-side rendering and optimized caching.",
      image: "/lederboxed.webp",
      link: "https://lederboxed.vercel.app",
      github: "https://github.com/fe-m-bueno/lederboxed",
      techs: [techs.Next, techs.React, techs.Tailwind, techs.TypeScript],
      metrics: ["500K+ titles", "SSR optimized", "Real-time search"],
    },
    {
      id: "2",
      title: "Recollagefm",
      description:
        "An app to create beautiful collages with album covers from your favorite artists using Last.fm API. Generates custom layouts dynamically.",
      image: "/recollagefm.webp",
      link: "https://recollagefm.vercel.app",
      github: "https://github.com/fe-m-bueno/recollagefm",
      techs: [techs.Next, techs.TypeScript, techs.Tailwind],
      metrics: ["API integration", "Dynamic layouts", "Export to image"],
    },
    {
      id: "3",
      title: "Break Stuff",
      description:
        "An AI-powered app to break down complex tasks into smaller, manageable subtasks. Uses Groq AI for intelligent task decomposition.",
      image: "/breakstuff.webp",
      link: "https://breakstuff.netlify.app",
      github: "https://github.com/fe-m-bueno/breakstuff",
      techs: [techs.Nuxt, techs.Vue, techs.Tailwind, techs.Groq, techs.Pinia],
      metrics: ["AI-powered", "Real-time generation", "State management"],
    },
    {
      id: "4",
      title: "Weather Now At",
      description:
        "A clean, responsive weather app with real-time data and location detection. Features detailed forecasts and weather alerts.",
      image: "/weathernowat.webp",
      link: "https://weathernowat.vercel.app",
      github: "https://github.com/fe-m-bueno/weathernowat",
      techs: [
        techs.Svelte,
        techs.SvelteKit,
        techs.TypeScript,
        techs.Tailwind,
        techs.WeatherAPI,
      ],
      metrics: ["Real-time data", "Geolocation", "7-day forecast"],
    },
    {
      id: "5",
      title: "Questione",
      description:
        "An AI-powered quiz generator using Gemini AI. Creates custom questions and answers for any topic instantly.",
      image: "/questione.webp",
      link: "https://questione.vercel.app",
      github: "https://github.com/fe-m-bueno/questione",
      techs: [techs.Next, techs.React, techs.Tailwind, techs.Gemini],
      metrics: ["Gemini AI", "Instant generation", "Custom topics"],
    },
    {
      id: "6",
      title: "Stopwatch",
      description:
        "A feature-rich web stopwatch with lap tracking, activity logging, and data persistence. Built for productivity tracking.",
      image: "/stopwatch.webp",
      link: "https://my-stopwatch-hazel.vercel.app",
      github: "https://github.com/fe-m-bueno/stopwatch",
      techs: [techs.Svelte, techs.SvelteKit, techs.TypeScript, techs.Tailwind],
      metrics: ["Lap tracking", "Local storage", "Export data"],
    },
  ],
  pt: [
    {
      id: "1",
      title: "Lederboxed",
      description:
        "Um aplicativo para explorar 500K+ filmes e séries usando a API do TMDB. Com renderização no servidor e cache otimizado.",
      image: "/lederboxed.webp",
      link: "https://lederboxed.vercel.app",
      github: "https://github.com/fe-m-bueno/lederboxed",
      techs: [techs.Next, techs.React, techs.Tailwind, techs.TypeScript],
      metrics: ["500K+ títulos", "SSR otimizado", "Busca em tempo real"],
    },
    {
      id: "2",
      title: "Recollagefm",
      description:
        "Um aplicativo para criar colagens lindas com capas de álbuns dos seus artistas favoritos usando a API do Last.fm. Gera layouts personalizados dinamicamente.",
      image: "/recollagefm.webp",
      link: "https://recollagefm.vercel.app",
      github: "https://github.com/fe-m-bueno/recollagefm",
      techs: [techs.Next, techs.TypeScript, techs.Tailwind],
      metrics: ["Integração API", "Layouts dinâmicos", "Exportar imagem"],
    },
    {
      id: "3",
      title: "Break Stuff",
      description:
        "Um aplicativo com IA para quebrar tarefas complexas em subtarefas menores e gerenciáveis. Usa Groq AI para decomposição inteligente.",
      image: "/breakstuff.webp",
      link: "https://breakstuff.netlify.app",
      github: "https://github.com/fe-m-bueno/breakstuff",
      techs: [techs.Nuxt, techs.Vue, techs.Tailwind, techs.Groq, techs.Pinia],
      metrics: ["IA integrada", "Geração em tempo real", "Gerência de estado"],
    },
    {
      id: "4",
      title: "Weather Now At",
      description:
        "Um aplicativo de clima limpo e responsivo com dados em tempo real e detecção de localização. Com previsões detalhadas e alertas.",
      image: "/weathernowat.webp",
      link: "https://weathernowat.vercel.app",
      github: "https://github.com/fe-m-bueno/weathernowat",
      techs: [
        techs.Svelte,
        techs.SvelteKit,
        techs.TypeScript,
        techs.Tailwind,
        techs.WeatherAPI,
      ],
      metrics: ["Dados em tempo real", "Geolocalização", "Previsão 7 dias"],
    },
    {
      id: "5",
      title: "Questione",
      description:
        "Um gerador de quiz com IA usando Gemini AI. Cria perguntas e respostas personalizadas para qualquer tópico instantaneamente.",
      image: "/questione.webp",
      link: "https://questione.vercel.app",
      github: "https://github.com/fe-m-bueno/questione",
      techs: [techs.Next, techs.React, techs.Tailwind, techs.Gemini],
      metrics: ["Gemini AI", "Geração instantânea", "Tópicos personalizados"],
    },
    {
      id: "6",
      title: "Stopwatch",
      description:
        "Um cronômetro web completo com rastreamento de voltas, registro de atividades e persistência de dados. Feito para produtividade.",
      image: "/stopwatch.webp",
      link: "https://my-stopwatch-hazel.vercel.app",
      github: "https://github.com/fe-m-bueno/stopwatch",
      techs: [techs.Svelte, techs.SvelteKit, techs.TypeScript, techs.Tailwind],
      metrics: ["Rastreio de voltas", "Armazenamento local", "Exportar dados"],
    },
  ],
};
