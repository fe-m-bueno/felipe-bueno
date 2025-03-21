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
    description: `I am ${calculateAge()} years old and have a degree in Business Administration, but my true passion has always been technology and programming. I am self-taught and learned to code by exploring different languages and frameworks, always striving to improve my skills and build challenging projects.

I studied at a military school, where I developed discipline and an analytical mindset—qualities I apply both in programming and in other aspects of my life. In addition, I have a deep passion for languages. I speak two languages fluently and have completed several courses on Duolingo, even finishing the Italian, French, and Japanese courses. For me, learning new languages has always been a way to expand my worldview and immerse myself in different cultures.

In my free time, I enjoy strategy games, follow the eSports scene, and have a strong passion for music, constantly exploring new styles. I am always seeking to learn more, whether in technology, languages, or my hobbies.`,
    tldr: [
      `${calculateAge()} years old`,
      "Frontend Developer",
      "Self-Taught Programmer",
      "Military School Graduate",
      "Fluent in Two Languages",
      "Business Administration Graduate",
      "Strategy Games & eSports Enthusiast",
      "Music Explorer",
    ],
  },

  pt: {
    title: "Sobre Mim",
    description: `Tenho ${calculateAge()} anos e sou formado em Administração, mas minha verdadeira paixão sempre foi a tecnologia e a programação. Sou autodidata e aprendi a programar explorando diferentes linguagens e frameworks, sempre buscando aprimorar minhas habilidades e construir projetos desafiadores.

Estudei em um colégio militar, onde desenvolvi disciplina e um pensamento analítico, qualidades que aplico tanto na programação quanto em outras áreas da minha vida. Além disso, sou apaixonado por idiomas. Falo fluentemente duas línguas e concluí diversos cursos no Duolingo, chegando a completar os de italiano, francês e japonês. Aprender novas línguas sempre foi, para mim, uma maneira de expandir minha visão de mundo e mergulhar em diferentes culturas.

No meu tempo livre, gosto de jogos de estratégia, acompanho o cenário de eSports e sou apaixonado por música, sempre explorando novos estilos. Estou constantemente em busca de aprendizado, seja na tecnologia, nos idiomas ou nos meus hobbies.`,
    tldr: [
      `${calculateAge()} anos`,
      "Desenvolvedor Frontend",
      "Programador Autodidata",
      "Formado em Colégio Militar",
      "Fluente em 2 idiomas",
      "Bacharel em Administração",
      "Entusiasta de Jogos de Estratégia & eSports",
      "Explorador Musical",
    ],
  },

  es: {
    title: "Sobre Mí",
    description: `Tengo ${calculateAge()} años y soy licenciado en Administración de Empresas, pero mi verdadera pasión siempre ha sido la tecnología y la programación. Soy autodidacta y aprendí a programar explorando diferentes lenguajes y frameworks, siempre buscando mejorar mis habilidades y desarrollar proyectos desafiantes.

Estudié en una escuela militar, donde desarrollé disciplina y un pensamiento analítico, cualidades que aplico tanto en la programación como en otros aspectos de mi vida. Además, me apasionan los idiomas. Hablo dos idiomas con fluidez y he completado varios cursos en Duolingo, incluyendo italiano, francés y japonés. Para mí, aprender nuevos idiomas siempre ha sido una forma de ampliar mi visión del mundo e involucrarme en diferentes culturas.

En mi tiempo libre, disfruto los juegos de estrategia, sigo la escena de los eSports y tengo una gran pasión por la música, siempre explorando nuevos estilos. Siempre estoy en busca de aprendizaje, ya sea en tecnología, idiomas o mis pasatiempos.`,
    tldr: [
      `${calculateAge()} años`,
      "Desarrollador Frontend",
      "Programador Autodidacta",
      "Graduado de Escuela Militar",
      "Fluido en 2 idiomas",
      "Licenciado en Administración",
      "Entusiasta de Juegos de Estrategia y eSports",
      "Explorador Musical",
    ],
  },
};
