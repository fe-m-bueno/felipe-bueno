'use client';
import AboutMe from './AboutSection';
import ContactForm from './ContactForm';
import Hero from './Hero';
import ProjectsSection from './ProjectsSection';
import ScrollReveal from './ScrollReveal';

export default function SectionContainer() {
  return (
    <div className="flex flex-col">
      <section
        id="landing"
        className="w-full min-h-screen flex flex-col justify-center items-center"
      >
        <Hero />
      </section>
      <section
        id="about"
        className="w-full min-h-screen flex flex-col justify-center items-center"
      >
        <ScrollReveal>
          <AboutMe />
        </ScrollReveal>
      </section>
      <section
        id="projects"
        className="w-full min-h-screen flex flex-col justify-center items-center"
      >
        <ScrollReveal delay={100}>
          <ProjectsSection />
        </ScrollReveal>
      </section>
      <section
        id="contact"
        className="relative w-full min-h-screen flex flex-col justify-center items-center"
      >
        <ScrollReveal delay={100}>
          <ContactForm />
        </ScrollReveal>
      </section>
    </div>
  );
}
