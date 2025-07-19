'use client';
import { motion } from 'motion/react';
import AboutMe from './AboutSection';
import ContactForm from './ContactForm';
import Hero from './Hero';
import ProjectsSection from './ProjectsSection';

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
        <AboutMe />
      </section>
      <section
        id="projects"
        className="w-full min-h-screen flex flex-col justify-center items-center"
      >
        <ProjectsSection />
      </section>
      <section
        id="contact"
        className="relative w-full min-h-screen flex flex-col justify-center items-center"
      >
        <ContactForm />
      </section>
    </div>
  );
}
