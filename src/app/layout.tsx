import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://divtime.ir"),
  applicationName: "DivTime",
  manifest: "/manifest.webmanifest",
  title: {
    default: "تایم | مدیریت زمان فارسی برای توسعه‌دهنده‌ها",
    template: "%s · تایم",
  },
  description:
    "تایم یک ابزار فارسی سبک برای کرنومتر، تایمر و پومودورو با همگام‌سازی حساب کاربری و ذخیره تنظیمات.",
  keywords: [
    "کرنومتر",
    "تایمر",
    "پومودورو",
    "برنامه روزانه",
    "مدیریت زمان",
    "توسعه‌دهنده",
    "برنامه‌نویس",
    "بهره‌وری",
    "فارسی",
  ],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#050812" },
  ],
  alternates: {
    canonical: "https://divtime.ir",
  },
  openGraph: {
    type: "website",
    title: "تایم | ابزار زمان برای توسعه‌دهنده‌ها",
    description:
      "کرنومتر و تایمر فارسی با دقت بالا، مناسب توسعه‌دهندگان و افراد حرفه‌ای؛ تنظیمات در حساب شما ذخیره می‌شود.",
    url: "https://divtime.ir",
    locale: "fa_IR",
    siteName: "تایم",
  },
  twitter: {
    card: "summary_large_image",
    title: "تایم | زمان در دست توسعه‌دهنده",
    description: "ابزار فارسی برای مدیریت زمان و پومودورو؛ کرنومتر دقیق و ذخیره تنظیمات روی حساب.",
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
  robots: {
    index: true,
    follow: true,
  },
  other: {
    enamad: "65366516",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
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
