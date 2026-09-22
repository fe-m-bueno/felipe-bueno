'use client';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import { GitHubIcon, LinkedInIcon } from './SocialIcons';

import LanguageSelector from './LanguageSelector';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { haptic } from '@/lib/haptic';

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const path = usePathname();

  const closeMenu = useCallback(() => { haptic(); setOpen(false); }, []);
  const openMenu = useCallback(() => { haptic(); setOpen(true); }, []);

  // As seções vivem na home; fora dela o hash sozinho não navega para lugar nenhum.
  const sectionHref = (hash: string) => (path === '/' ? `#${hash}` : `/#${hash}`);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, closeMenu]);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-screen">
      <div className="relative overflow-visible">
        <div className="~mx-4/8 lg:~mx-24/48 flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Link
              href={sectionHref('landing')}
              aria-label={t('navbar.home')}
              onClick={() => haptic()}
              className="font-bold ~text-base/xl font-space-grotesk"
            >
              FELIPE BUENO
            </Link>
          </div>
          <div className="hidden lg:flex items-center space-x-8 text-medium font-space-grotesk overflow-visible">
            <Link
              href="https://linkedin.com/in/felipe-martins-bueno"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              onClick={() => haptic()}
              className="hover:scale-110 transition duration-100"
            >
              <LinkedInIcon />
            </Link>
            <Link
              href="https://github.com/fe-m-bueno"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              onClick={() => haptic()}
              className="hover:scale-110 transition duration-100"
            >
              <GitHubIcon />
            </Link>
            <Link
              href={sectionHref('about')}
              onClick={() => haptic()}
              className="relative after:bg-black dark:after:bg-white after:absolute after:h-[2px] after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
            >
              {t('navbar.about')}
            </Link>
            <Link
              href={path === '/' ? '#projects' : '/projects'}
              onClick={() => haptic()}
              className="relative after:bg-black dark:after:bg-white after:absolute after:h-[2px] after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
            >
              {t('navbar.projects')}
            </Link>
            <Link
              href="/words"
              onClick={() => haptic()}
              aria-current={path.startsWith('/words') ? 'page' : undefined}
              className="relative after:bg-black dark:after:bg-white after:absolute after:h-[2px] after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
            >
              {t('navbar.words')}
            </Link>
            <Link
              href={sectionHref('contact')}
              onClick={() => haptic()}
              className="relative after:bg-black dark:after:bg-white after:absolute after:h-[2px] after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
            >
              {t('navbar.contact')}
            </Link>
            <Link
              href="https://tldr.felipe-bueno.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('navbar.tldrLabel')}
              onClick={() => haptic()}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-mono text-sm transition-colors"
            >
              {t('navbar.tldr')}
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
            <ThemeToggle />
            <LanguageSelector />
          </div>
          <button
            onClick={openMenu}
            aria-label={t('navbar.openMenu')}
            aria-expanded={open}
            className="lg:hidden flex gap-2 dark:hover:bg-white/25 transition-colors duration-200 ease-in-out active:translate-y-1 dark:active:bg-white/45 active:bg-black/15 hover:bg-black/5 rounded px-2 py-2 cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div
            onClick={closeMenu}
            className={`fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300 ${
              open ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t('navbar.navigationMenu')}
            onKeyDown={(e) => e.key === 'Enter' && closeMenu()}
            className={`fixed top-0 right-0 w-64 h-full bg-white dark:bg-zinc-950 z-50 shadow-xl flex flex-col items-start p-6 transition-transform duration-300 ease-out ${
              open ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <button
              onClick={closeMenu}
              aria-label={t('navbar.closeMenu')}
              className="self-end p-2 rounded hover:bg-black/5 dark:hover:bg-rose-600 active:translate-y-1 dark:active:bg-rose-700 active:bg-black/15 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <nav className="flex flex-col space-y-4 mt-4 w-full pr-8 font-space-grotesk">
              <Link
                href={sectionHref('landing')}
                onClick={closeMenu}
                className="text-lg font-medium hover:text-rose-500 transition-colors"
              >
                {t('navbar.home')}
              </Link>
              <Link
                href={sectionHref('about')}
                onClick={closeMenu}
                className="text-lg font-medium hover:text-rose-500 transition-colors"
              >
                {t('navbar.about')}
              </Link>
              <Link
                href={path === '/' ? '#projects' : '/projects'}
                onClick={closeMenu}
                className="text-lg font-medium hover:text-rose-500 transition-colors"
              >
                {t('navbar.projects')}
              </Link>
              <Link
                href="/words"
                onClick={closeMenu}
                aria-current={path.startsWith('/words') ? 'page' : undefined}
                className="text-lg font-medium hover:text-rose-500 transition-colors"
              >
                {t('navbar.words')}
              </Link>
              <Link
                href={sectionHref('contact')}
                onClick={closeMenu}
                className="text-lg font-medium hover:text-rose-500 transition-colors"
              >
                {t('navbar.contact')}
              </Link>
              <Link
                href="https://linkedin.com/in/felipe-martins-bueno"
                target="_blank"
                className="text-lg font-medium hover:text-rose-500 flex items-center justify-start gap-2 transition-colors"
              >
                LinkedIn <LinkedInIcon />
              </Link>
              <Link
                href="https://github.com/fe-m-bueno"
                target="_blank"
                className="text-lg font-medium hover:text-rose-500 flex items-center justify-start gap-2 transition-colors"
              >
                GitHub <GitHubIcon />
              </Link>
              <Link
                href="https://tldr.felipe-bueno.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('navbar.tldrLabel')}
                onClick={closeMenu}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-mono text-lg transition-colors"
              >
                {t('navbar.tldr')}
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <div className="flex justify-between items-center gap-2">
                <ThemeToggle />
                <LanguageSelector />
              </div>
            </nav>
          </div>
        </div>

        <div className="absolute inset-0 bg-white dark:bg-black blur -z-10 h-2/3 lg:h-5/6"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-white via-white/[99%]  to-transparent dark:from-black lg:dark:via-black/35 dark:via-black/95 dark:to-transparent h-20 -z-10"></div>
      </div>
    </nav>
  );
}
