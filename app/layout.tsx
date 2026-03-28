import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import localFont from "next/font/local";
import "./globals.css";
import I18nProvider from "@/components/i18nProvider";
import Navbar from "@/components/TheNavbar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import TheFooter from "@/components/TheFooter";
import StructuredData from "@/components/StructuredData";
import { normalizeTheme } from "@/lib/theme";

const ibmPlexSans = localFont({
  src: [
    {
      path: "../node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2",
      style: "normal",
      weight: "100 700",
    },
  ],
  variable: "--font-sans",
  preload: true,
  display: "swap",
});

const spaceGrotesk = localFont({
  src: [
    {
      path: "../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
      style: "normal",
      weight: "300 700",
    },
  ],
  variable: "--font-space-grotesk",
  preload: true,
  display: "swap",
});

const geistMono = localFont({
  src: [
    {
      path: "../node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
      style: "normal",
      weight: "100 900",
    },
  ],
  variable: "--font-mono",
  preload: true,
  display: "swap",
});

export const metadata: Metadata = {
  title: "Felipe Bueno | Fullstack Developer",
  description:
    "Fullstack Developer specializing in Python (Django), TypeScript (React, Angular, Next.js), Apache Airflow, and PostgreSQL. Building scalable web solutions and ETL pipelines. Open to remote work worldwide.",
  authors: [{ name: "Felipe Bueno", url: "https://felipe-bueno.com" }],
  creator: "Felipe Bueno",
  publisher: "Felipe Bueno",
  applicationName: "Felipe Bueno - Portfolio",
  keywords: [
    "Fullstack Developer",
    "Python Developer",
    "Django Developer",
    "TypeScript Developer",
    "React Developer",
    "Next.js Developer",
    "Angular Developer",
    "Apache Airflow",
    "ETL Pipelines",
    "PostgreSQL",
    "Docker",
    "AWS",
    "Remote Developer",
    "Software Engineer",
    "Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "Felipe Bueno",
    "Brazil Developer",
    "Data Engineering",
    "REST API",
    "GraphQL",
    "Tailwind CSS",
  ],
  category: "technology",
  openGraph: {
    title: "Felipe Bueno | Fullstack Developer",
    description:
      "Fullstack Developer with 1+ year of experience. Processing 10K+ daily records via Apache Airflow. Expert in Python (Django), TypeScript (React/Angular), PostgreSQL optimization. Available for remote work worldwide.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["pt_BR", "es_ES"],
    images: [
      {
        url: "/felipe-bueno.png",
        width: 1200,
        height: 630,
        alt: "Felipe Bueno - Fullstack Developer",
      },
    ],
    url: "https://felipe-bueno.com",
    siteName: "Felipe Bueno Portfolio",
  },
  twitter: {
    title: "Felipe Bueno | Fullstack Developer - Python, TypeScript, React",
    description:
      "Fullstack Developer specializing in scalable web solutions. Python (Django), TypeScript (React/Angular), Apache Airflow, PostgreSQL. Open to remote work.",
    card: "summary_large_image",
    images: ["https://felipe-bueno.com/felipe-bueno.png"],
    creator: "@fe_m_bueno",
  },
  alternates: {
    canonical: "https://felipe-bueno.com",
    languages: {
      "en-US": "https://felipe-bueno.com",
      "pt-BR": "https://felipe-bueno.com",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/felipe-bueno.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f43f5e",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = normalizeTheme(cookieStore.get("theme")?.value) ?? "light";
  const htmlClassName = theme === "dark" ? "dark" : undefined;

  return (
    <html lang="en" data-mode={theme} className={htmlClassName}>
      <head>
        <StructuredData />
        <link
          rel="preload"
          as="image"
          href="/bg-main.webp"
          type="image/webp"
        />
      </head>
      <body
        className={`${ibmPlexSans.variable} ${spaceGrotesk.variable} ${geistMono.variable} font-sans`}
      >
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
