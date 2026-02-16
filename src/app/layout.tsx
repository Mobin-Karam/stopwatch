import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://time.example.com"),
  title: "تایم | مدیریت زمان فارسی",
  description:
    "تایم: ابزار فارسی و سبک برای توسعه‌دهندگان و حرفه‌ای‌ها که می‌خواهند زمان را در دست بگیرند؛ کرنومتر دقیق، تایمر، پومودورو و برنامه روزانه با ذخیره حساب.",
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
  themeColor: "#0f172a",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "تایم | ابزار زمان برای توسعه‌دهندگان",
    description:
      "کرنومتر و تایمر فارسی با دقت بالا، مناسب توسعه‌دهندگان و افراد حرفه‌ای؛ تنظیمات در حساب شما ذخیره می‌شود.",
    url: "https://time.example.com/",
    locale: "fa_IR",
    siteName: "تایم",
  },
  twitter: {
    card: "summary",
    title: "تایم | زمان در دست توسعه‌دهنده",
    description:
      "ابزار فارسی برای مدیریت زمان، مناسب توسعه‌دهنده و فریلنسر؛ کرنومتر، تایمر و پومودورو با ذخیره تنظیمات.",
  },
  icons: {
    icon: "/vite.svg",
  },
  other: {
    enamad: "65366516",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen bg-[var(--bg)] text-slate-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
