import type { Metadata } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Time",
  description: "Stopwatch and time utilities",
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
