"use client";
import Image from 'next/image';
import Badge from './Badge';
import Link from 'next/link';
import { GitHub } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import LiquidGlass from './LiquidGlass';

type ProjectProps = {
  title: string;
  description: string;
  image: string;
  link: string;
  github: string;
  techs: { name: string; icon: string }[];
  height?: number;
};

export default function ProjectCard({
  title,
  description,
  image,
  link,
  github,
  techs,
  height,
}: ProjectProps) {
  const { t } = useTranslation();
  return (
    <LiquidGlass variant="card" className="relative p-2 rounded-lg group">
      <div
        className="w-full overflow-hidden rounded-lg"
        style={{ height: height ? `${height}px` : '24rem' }}
      >
        <Image
          src={image}
          alt={title}
          width={1980}
          height={1080}
          loading="lazy"
          className="rounded-lg group-hover:brightness-125 transition-all ease-in-out duration-200 object-cover"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-black via-black/85 to-transparent rounded-lg"></div>
      <div className="absolute bottom-0 left-0 w-full p-6 z-10">
        <h2 className="mt-4 text-2xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-gray-200 line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-1.5 md:gap-2 mt-4">
          {techs.map((tech, index) => (
            <div key={index} className="flex items-center">
              {tech.icon ? (
                <Badge name={tech.name} icon={tech.icon} />
              ) : (
                <span className="text-xs md:text-sm">{tech.name}</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 md:gap-4">
          <Link
            href={link}
            target="_blank"
            className="px-3 py-1 bg-rose-600/85 hover:bg-rose-500/85 backdrop-blur-md dark:bg-rose-600/85 dark:hover:bg-rose-700/85 border border-gray-200/20 rounded-xl text-white transition font-bold ~text-sm/base"
          >
            {t('projects.viewProject')}
          </Link>
          <Link
            href={github}
            target="_blank"
            className="px-3 py-1 bg-white/85 hover:bg-white/100 dark:bg-white/5 dark:hover:bg-white/25 backdrop-blur border border-gray-200/20 rounded-xl transition ~text-sm/base"
          >
            <span className="flex items-center justify-center gap-2">
              <GitHub className="w-6 h-6" />
              GitHub
            </span>
          </Link>
        </div>
      </div>
    </LiquidGlass>
  );
}
