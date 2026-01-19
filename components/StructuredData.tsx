export default function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Felipe Bueno",
    alternateName: "Felipe Martins Bueno",
    url: "https://felipe-bueno.com",
    image: "https://felipe-bueno.com/felipe-bueno.png",
    jobTitle: "Fullstack Developer",
    description:
      "Fullstack Developer specializing in Python (Django), TypeScript (React, Angular, Next.js), Apache Airflow, and PostgreSQL. Building scalable web solutions and ETL pipelines.",
    worksFor: {
      "@type": "Organization",
      name: "Pilgrims Consulting",
    },
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "Pontifical Catholic University of Paraná",
        sameAs: "https://www.pucpr.br",
      },
      {
        "@type": "EducationalOrganization",
        name: "Federal University of Paraná",
        sameAs: "https://www.ufpr.br",
      },
    ],
    knowsAbout: [
      "Python",
      "Django",
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "Angular",
      "Vue.js",
      "Svelte",
      "Node.js",
      "PostgreSQL",
      "SQL Server",
      "Docker",
      "Apache Airflow",
      "ETL",
      "Data Engineering",
      "REST API",
      "GraphQL",
      "Tailwind CSS",
      "AWS",
      "Web Development",
      "Fullstack Development",
    ],
    knowsLanguage: [
      {
        "@type": "Language",
        name: "Portuguese",
        alternateName: "pt",
      },
      {
        "@type": "Language",
        name: "English",
        alternateName: "en",
      },
      {
        "@type": "Language",
        name: "Spanish",
        alternateName: "es",
      },
    ],
    sameAs: [
      "https://github.com/fe-m-bueno",
      "https://linkedin.com/in/felipe-martins-bueno",
    ],
    email: "mailto:contact@felipe-bueno.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "BR",
      addressLocality: "Curitiba",
      addressRegion: "PR",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Felipe Bueno Portfolio",
    alternateName: "Felipe Bueno - Fullstack Developer",
    url: "https://felipe-bueno.com",
    description:
      "Professional portfolio of Felipe Bueno, Fullstack Developer specializing in Python, TypeScript, and modern web technologies.",
    inLanguage: ["en", "pt"],
    author: {
      "@type": "Person",
      name: "Felipe Bueno",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://felipe-bueno.com/projects?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Felipe Bueno - Fullstack Development Services",
    image: "https://felipe-bueno.com/felipe-bueno.png",
    url: "https://felipe-bueno.com",
    telephone: "+55-41-99589-8131",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "BR",
      addressLocality: "Curitiba",
      addressRegion: "PR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -25.4284,
      longitude: -49.2733,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      "https://github.com/fe-m-bueno",
      "https://linkedin.com/in/felipe-martins-bueno",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceSchema),
        }}
      />
    </>
  );
}


