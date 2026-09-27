import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "David Ericson | Fullstack Dev",
  description:
    "Portfólio de David Ericson, desenvolvedor Fullstack com foco em Node.js, TypeScript, APIs, PostgreSQL e arquitetura de sistemas.",
  authors: [{ name: "David Ericson" }],
  creator: "David Ericson",
  keywords: [
    "David Ericson",
    "Fullstack Developer",
    "Desenvolvedor Fullstack",
    "Node.js",
    "TypeScript",
    "React",
    "Next.js",
    "PostgreSQL",
  ],
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}