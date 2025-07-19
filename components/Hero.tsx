'use client';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import useMousePosition from '@/components/utils/mouse-position';
import { useState } from 'react';
import { EyeClosed } from 'lucide-react';
import Badge from '@/components/Badge';

const skills = [
  { name: 'HTML', icon: 'flowbite:html-solid' },
  { name: 'CSS', icon: 'flowbite:css-solid' },
  { name: 'JavaScript', icon: 'ri:javascript-fill' },
  { name: 'TypeScript', icon: 'bxl:typescript' },
  { name: 'React', icon: 'mdi:react' },
  { name: 'React Native', icon: 'mdi:react' },
  { name: 'Vue.js', icon: 'mdi:vuejs' },
  { name: 'Nuxt.js', icon: 'lineicons:nuxt' },
  { name: 'Next.js', icon: 'ri:nextjs-fill' },
  { name: 'Node.js', icon: 'mdi:nodejs' },
  { name: 'Svelte', icon: 'ri:svelte-fill' },
  { name: 'Tailwind CSS', icon: 'mdi:tailwind' },
  { name: 'GraphQL', icon: 'mdi:graphql' },
  { name: 'Apollo Studio', icon: 'file-icons:apollo' },
  { name: 'Swift', icon: 'lineicons:swift' },
  { name: 'Drizzle', icon: 'lineicons:drizzle' },
  { name: 'Prisma', icon: 'lineicons:prisma' },
  { name: 'Figma', icon: 'solar:figma-bold' },
  { name: 'Storybook', icon: 'cib:storybook' },
  { name: 'Adobe Premiere', icon: 'basil:adobe-premiere-solid' },
  { name: 'Adobe After Effects', icon: 'basil:adobe-after-effects-solid' },
  { name: 'Adobe Illustrator', icon: 'basil:adobe-illustrator-solid' },
  { name: 'Adobe Photoshop', icon: 'basil:adobe-photoshop-solid' },
];

export default function Hero() {
  const { t } = useTranslation();
  const { x, y } = useMousePosition();
  const [filter, setFilter] = useState(true);
  return (
    <section className="relative grid grid-cols-1 lg:grid-cols-2 items-center justify-center text-center px-4 w-full mt-24 lg:mt-0 max-w-8xl mx-auto">
      <div className="lg:grid lg:grid-rows-4 lg:h-screen flex flex-col justify-center items-center">
        <div className="lg:row-start-2 flex flex-col justify-center items-center lg:items-start lg:ml-32 mx-auto sm:pl-0 lg:pl-24">
          <motion.h1
            className="~text-3xl/7xl mb-8 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <span className="font-bold inline-block text-nowrap">
              {t('hero.title')}
              <motion.span
                animate={{ rotateZ: [0, 10, -10, 10, -10, 0] }}
                transition={{
                  duration: 1,
                  ease: 'easeInOut',
                  repeat: Infinity,
                }}
                className="inline-block ml-2"
              >
                👋
              </motion.span>
            </span>
          </motion.h1>
          <motion.p
            className="~text-base/2xl mb-8 text-center lg:text-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {t('hero.description')}
          </motion.p>
          <motion.p
            className="~text-base/2xl mb-8 text-center lg:text-start font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {t('hero.description2')}
          </motion.p>
        </div>
        <div className="lg:row-start-3 flex flex-wrap justify-center items-center lg:justify-start lg:items-start gap-2 lg:ml-32 h-fit lg:mt-12 lg:mt-24 mx-auto sm:pl-0 lg:pl-24">
          {skills.map((skill) => (
            <Badge key={skill.name} name={skill.name} icon={skill.icon} />
          ))}
        </div>
      </div>

      <motion.div
        className="relative flex flex-col items-center justify-center mt-8 lg:mt-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          rotateX:
            (y / (typeof window !== 'undefined' ? window.innerHeight : 0) -
              0.5) *
            35,
          rotateY:
            (x / (typeof window !== 'undefined' ? window.innerWidth : 0) -
              0.5) *
            35,
        }}
        style={{
          perspective: 1000,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 5, mass: 0.5 }}
      >
        <div
          className="rounded-3xl p-px h-1/2 w-1/2 lg:h-full overflow-hidden bg-gradient-to-b from-rose-400 to-rose-400/10 shadow-2xl shadow-white/10"
          onClick={() => setFilter(!filter)}
        >
          {filter && (
            <p className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-base z-10 text-white font-semibold px-8 lg:px-0">
              <span className="inline-flex items-center gap-2">
                <EyeClosed className="w-6 h-6" /> {t('hero.clickToRemoveBlur')}
              </span>
            </p>
          )}
          <div className="relative p-[2px] rounded-[calc(1.25rem-1px)]">
            <div
              className={`absolute inset-0 p-px rounded-3xl transition-all duration-100 ${
                filter
                  ? 'backdrop-blur-xl backdrop-brightness-75 dark:backdrop-brightness-50'
                  : ''
              }`}
            />

            <Image
              src="/hero.jpg"
              alt="Hero Image"
              width={500}
              height={500}
              className="rounded-3xl transition-all duration-100"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
