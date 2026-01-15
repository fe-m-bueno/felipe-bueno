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
    description: `I am ${calculateAge()} years old with a degree in Business Administration and currently pursuing Systems Analysis and Development at PUCPR. My passion for technology led me from self-teaching to professional fullstack development, where I architect scalable solutions across the entire stack.

I studied at a military school, developing discipline and analytical thinking that I apply to software engineering, from designing data pipelines to crafting intuitive user interfaces. My curiosity extends beyond code: I speak multiple languages fluently and have completed courses in Italian, French, and Japanese on Duolingo, which helps me collaborate in diverse, multicultural teams.

Currently working as a Junior Systems Analyst at Pilgrims Consulting, I specialize in Python (Django), TypeScript (Angular), Apache Airflow, Docker, and database optimization. I thrive on solving complex problems and continuously expanding my technical expertise.`,
    tldr: [
      `${calculateAge()} years old`,
      "Fullstack Developer",
      "Data Engineering",
      "Systems Analysis Student @ PUCPR",
      "Fluent in Multiple Languages",
      "Business Administration Background",
      "Fast Learner & Problem Solver",
      "Self-taught",
    ],
  },

  pt: {
    title: "Sobre Mim",
    description: `Tenho ${calculateAge()} anos, sou formado em Administração e atualmente curso Análise e Desenvolvimento de Sistemas na PUCPR. Minha paixão por tecnologia me levou do aprendizado autodidata ao desenvolvimento fullstack profissional, onde arquiteto soluções escaláveis em toda a stack.

Estudei em colégio militar, desenvolvendo disciplina e pensamento analítico que aplico na engenharia de software, desde o design de pipelines de dados até a criação de interfaces intuitivas. Minha curiosidade vai além do código: falo múltiplos idiomas fluentemente e completei cursos de italiano, francês e japonês no Duolingo, o que me ajuda a colaborar em equipes multiculturais.

Atualmente trabalho como Analista de Sistemas Júnior na Pilgrims Consulting, especializado em Python (Django), TypeScript (Angular), Apache Airflow, Docker e otimização de bancos de dados. Prospero resolvendo problemas complexos e expandindo continuamente minha expertise técnica.`,
    tldr: [
      `${calculateAge()} anos`,
      "Desenvolvedor Fullstack",
      "Engenharia de Dados",
      "Estudante de ADS @ PUCPR",
      "Fluente em Múltiplos Idiomas",
      "Formação em Administração",
      "Aprendizado Rápido & Resolução de Problemas",
      "Autodidata",
    ],
  },
};
