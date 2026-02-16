'use client';

import { useEffect, type ReactNode } from "react";
import { AuthProvider } from "../auth/AuthProvider";
import { I18nProvider } from "../i18n/I18nProvider";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.error("SW registration failed", err));
    }
  }, []);

  return (
    <AuthProvider>
      <I18nProvider>{children}</I18nProvider>
    </AuthProvider>
  );
}
