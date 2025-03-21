import type { Metadata } from "next";
import "./globals.css";
import I18nProvider from "@/components/i18nProvider";
import Navbar from "@/components/TheNavbar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const metadata: Metadata = {
  title: "Felipe Bueno",
  description:
    "Felipe Bueno is a frontend web developer with a passion for creating beautiful and functional user interfaces.",
  authors: [{ name: "Felipe Bueno" }],
  applicationName: "Felipe Bueno -Portfolio",
  keywords: [
    "portfolio",
    "Felipe Bueno",
    "frontend developer",
    "web developer",
  ],
  openGraph: {
    title: "Felipe Bueno",
    description:
      "Felipe Bueno is a frontend web developer with a passion for creating beautiful and functional user interfaces.",
    type: "website",
    images: ["/felipe-bueno.png"],
    url: "https://felipe-bueno.com",
  },
  twitter: {
    title: "Felipe Bueno",
    description:
      "Felipe Bueno is a frontend web developer with a passion for creating beautiful and functional user interfaces.",
    card: "summary_large_image",
    images: ["https://felipe-bueno.com/felipe-bueno.png"],
  },
  alternates: {
    canonical: "https://felipe-bueno.com",
  },
  icons: {
    icon: "/favicon.ico",
  },
  themeColor: "#f43f5e",
  colorScheme: "dark",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <Navbar />
          {children}
          <Analytics />
          <SpeedInsights />
        </I18nProvider>
      </body>
    </html>
  );
}
