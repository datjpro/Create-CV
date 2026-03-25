import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

import { getPreferencesBootstrapScript } from "@/lib/services/app-preferences-shared";

import "./globals.css";
import { AppProviders } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-headline"
});

export const metadata: Metadata = {
  title: "CV-Tech",
  description: "Create modern ATS-ready resumes with live preview and multi-template PDF export."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getPreferencesBootstrapScript() }} />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} ${manrope.variable} bg-surface text-on-surface`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

