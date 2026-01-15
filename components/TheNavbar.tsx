'use client';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LinkedIn, GitHub } from '@mui/icons-material';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-screen">
      <div className="relative">
        <div className="~mx-4/8 lg:~mx-24/48 flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Link
              href={path === '/projects' ? '/' : '#landing'}
              aria-label="Home"
              className="font-bold ~text-base/xl font-space-grotesk"
            >
              FELIPE BUENO
            </Link>
          </div>
          <div className="hidden lg:flex items-center space-x-8 text-medium font-space-grotesk">
            <Link
              href="https://linkedin.com/in/felipe-martins-bueno"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:scale-110 transition duration-100"
            >
              <LinkedIn
                fill="currentColor"
                aria-hidden="true"
                fontSize="medium"
              />
            </Link>
            <Link
              href="https://github.com/fe-m-bueno"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:scale-110 transition duration-100"
            >
              <GitHub
                fill="currentColor"
                aria-hidden="true"
                fontSize="medium"
              />
            </Link>
            <Link
              href="#about"
              className="relative after:bg-black dark:after:bg-white after:absolute after:h-[2px] after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
              suppressHydrationWarning
            >
              {t('navbar.about')}
            </Link>
            <Link
              href="#projects"
              className="relative after:bg-black dark:after:bg-white after:absolute after:h-[2px] after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
              suppressHydrationWarning
            >
              {t('navbar.projects')}
            </Link>
            <Link
              href="#contact"
              className="relative after:bg-black dark:after:bg-white after:absolute after:h-[2px] after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
              suppressHydrationWarning
            >
              {t('navbar.contact')}
            </Link>
            <ThemeToggle />
            <LanguageSelector />
          </div>
          <div
            onClick={() => setOpen(true)}
            className="lg:hidden flex gap-2 dark:hover:bg-white/25 transition-all duration-200 ease-in-out active:translate-y-1 dark:active:bg-white/45 active:bg-black/15 hover:bg-black/5 rounded px-2 py-2 cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </div>
          {open && (
            <div
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
          )}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: open ? '0%' : '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onKeyDown={(e) => e.key === 'Enter' && setOpen(false)}
            className="fixed top-0 right-0 w-64 h-full bg-white dark:bg-zinc-950 z-50 shadow-xl flex flex-col items-start p-6"
          >
            <button
              onClick={() => setOpen(false)}
              className="self-end p-2 rounded hover:bg-black/5 dark:hover:bg-rose-600 active:translate-y-1 dark:active:bg-rose-700 active:bg-black/15 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <nav className="flex flex-col space-y-4 mt-4 w-full pr-8 font-space-grotesk">
              <Link
                href="#landing"
                onClick={() => setOpen(false)}
                className="text-lg font-medium hover:text-rose-500"
                suppressHydrationWarning
              >
                {t('navbar.home')}
              </Link>
              <Link
                href="#about"
                onClick={() => setOpen(false)}
                className="text-lg font-medium hover:text-rose-500"
                suppressHydrationWarning
              >
                {t('navbar.about')}
              </Link>
              <Link
                href="#projects"
                onClick={() => setOpen(false)}
                className="text-lg font-medium hover:text-rose-500"
                suppressHydrationWarning
              >
                {t('navbar.projects')}
              </Link>

              <Link
                href="#contact"
                onClick={() => setOpen(false)}
                className="text-lg font-medium hover:text-rose-500"
                suppressHydrationWarning
              >
                {t('navbar.contact')}
              </Link>
              <Link
                href="https://linkedin.com/in/felipe-martins-bueno"
                target="_blank"
                className="text-lg font-medium hover:text-rose-500 flex items-center justify-start gap-2"
              >
                LinkedIn <LinkedIn className="w-6 h-6" />
              </Link>
              <Link
                href="https://github.com/fe-m-bueno"
                target="_blank"
                className="text-lg font-medium hover:text-rose-500 flex items-center justify-start gap-2"
              >
                GitHub <GitHub className="w-6 h-6" />
              </Link>
              <div className="flex justify-between items-center gap-2">
                <ThemeToggle />
                <LanguageSelector />
              </div>
            </nav>
          </motion.div>
        </div>

        <div className="absolute inset-0 bg-white dark:bg-black blur -z-10 h-2/3 lg:h-5/6"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-white via-white/[99%]  to-transparent dark:from-black lg:dark:via-black/35 dark:via-black/95 dark:to-transparent h-20 -z-10"></div>
      </div>
    </nav>
  );
}
