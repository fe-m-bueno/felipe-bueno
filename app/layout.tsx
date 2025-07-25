import type { Metadata, Viewport } from 'next';
import './globals.css';
import I18nProvider from '@/components/i18nProvider';
import Navbar from '@/components/TheNavbar';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import TheFooter from '@/components/TheFooter';

export const metadata: Metadata = {
  title: 'Felipe Bueno',
  description:
    'Felipe Bueno is a frontend web developer with a passion for creating beautiful and functional user interfaces.',
  authors: [{ name: 'Felipe Bueno' }],
  applicationName: 'Felipe Bueno -Portfolio',
  keywords: [
    'portfolio',
    'Felipe Bueno',
    'frontend developer',
    'web developer',
  ],
  openGraph: {
    title: 'Felipe Bueno',
    description:
      'Felipe Bueno is a frontend web developer with a passion for creating beautiful and functional user interfaces.',
    type: 'website',
    images: ['/felipe-bueno.png'],
    url: 'https://felipe-bueno.com',
  },
  twitter: {
    title: 'Felipe Bueno',
    description:
      'Felipe Bueno is a frontend web developer with a passion for creating beautiful and functional user interfaces.',
    card: 'summary_large_image',
    images: ['https://felipe-bueno.com/felipe-bueno.png'],
  },
  alternates: {
    canonical: 'https://felipe-bueno.com',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#f43f5e',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/bg-main.webp" />
        <link rel="preload" as="image" href="/bg-main-dark.webp" />
        <script
          id="theme-init"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-mode', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  document.documentElement.setAttribute('data-mode', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <I18nProvider>
          <Navbar />
          {children}
          <Analytics />
          <SpeedInsights />
          <TheFooter />
        </I18nProvider>
      </body>
    </html>
  );
}
