import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { JsonLd } from "@/components/seo/JsonLd";

import { buildPersonSchema } from "@/lib/seo/schemas/person";
import { buildWebsiteSchema } from "@/lib/seo/schemas/website";
import { SITE_CONFIG } from "@/lib/seo/config";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { getTechnologies } from "@/lib/data/technologies";

import { FirebaseAnalytics } from "@/components/analytics/FirebaseAnalytics";

import { GoogleTagManager } from "@next/third-parties/google";
import { UtmCleaner } from "@/components/analytics/UtmCleaner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0b0d12",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),

  title: {
    template: `%s | ${SITE_CONFIG.name}`,
    default: `${SITE_CONFIG.name} | Fullstack Dev`,
  },

  description: SITE_CONFIG.description,

  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/site.webmanifest",

  openGraph: {
    siteName: SITE_CONFIG.siteName,
    locale: SITE_CONFIG.locale,
    type: "website",
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.name} | Fullstack Dev`,
    description: SITE_CONFIG.description,

    images: [
      {
        url: `${SITE_CONFIG.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} | Fullstack Dev`,
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: SITE_CONFIG.twitterHandle,
    creator: SITE_CONFIG.twitterHandle,
    title: `${SITE_CONFIG.name} | Fullstack Dev`,
    description: SITE_CONFIG.description,
    images: [
      `${SITE_CONFIG.url}/og-image.png`,
    ],
  },
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const technologies = await getTechnologies();

  return (
    <html
      lang={SITE_CONFIG.language}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <GoogleTagManager gtmId="GTM-TCMMB226" />

      <body className="min-h-full flex flex-col">
        <UtmCleaner />

        <JsonLd
          schema={[
            await buildPersonSchema(technologies),
            buildWebsiteSchema(),
          ]}
        />

        <Header />

        {children}

        <Footer />

        <FirebaseAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}