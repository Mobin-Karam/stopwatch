import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://divtime.ir"),
  applicationName: "دایو تایم",
  manifest: "/manifest.webmanifest",
  title: {
    default: "دایو تایم | مدیریت زمان برای توسعه‌دهنده‌ها",
    template: "%s · دایو تایم",
  },
  description:
    "دایو تایم کرنومتر، تایمر، پومودورو، برنامه‌ریز، چت و اتاق صوتی را یکجا ارائه می‌کند. ورود با OAuth، سشن کوکی و استریم زنده پشتیبانی می‌شود.",
  keywords: ["کرنومتر", "تایمر", "پومودورو", "برنامه‌ریز", "مدیریت زمان", "بهره‌وری"],
  alternates: { canonical: "https://divtime.ir" },
  openGraph: {
    type: "website",
    title: "دایو تایم | ابزار زمان برای توسعه‌دهنده‌ها",
    description:
      "ردیابی زمان، پومودورو، برنامه‌ریزی وظایف و همکاری تیمی در یک رابط فارسی.",
    url: "https://divtime.ir",
    locale: "fa_IR",
    siteName: "دایو تایم",
  },
  twitter: {
    card: "summary_large_image",
    title: "دایو تایم | مدیریت زمان",
    description: "کرنومتر، تایمر، پومودورو، برنامه‌ریز، چت و صوت برای تیم‌ها.",
  },
  icons: {
    icon: [
      { url: "/icons/divtime-logo.svg", type: "image/svg+xml" },
      { url: "/icons/divtime-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/divtime-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/divtime-180.png", sizes: "180x180" }],
    shortcut: [{ url: "/icons/divtime-128.png", sizes: "128x128", type: "image/png" }],
  },
  robots: { index: true, follow: true },
  other: { enamad: "65366516" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#050812" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-[var(--bg)] text-slate-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
