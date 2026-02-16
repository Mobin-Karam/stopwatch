import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchTranslations } from "./server";
import { useTranslationBuilder } from "./useTranslation";
import type { Lang, Messages } from "./types";

type Vars = Record<string, string | number>;

type I18nContextValue = {
  lang: Lang | null;
  dir: "ltr" | "rtl";
  t: (key: string, vars?: Vars) => string;
  setLanguage: (lang: Lang) => Promise<void>;
  loading: boolean;
  ready: boolean;
  hasSelection: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang | null>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    return (stored as Lang | null) ?? null;
  });
  const [messages, setMessages] = useState<Messages | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [hasSelection, setHasSelection] = useState<boolean>(Boolean(lang));

  useEffect(() => {
    if (!lang) return;

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const bundle = await fetchTranslations(lang);
        if (!cancelled) {
          setMessages(bundle);
          localStorage.setItem("lang", lang);
          setHasSelection(true);
          setReady(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  useEffect(() => {
    const dir = lang === "fa" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang ?? "en";
  }, [lang]);

  const t = useTranslationBuilder(messages);

  const setLanguage = async (next: Lang) => {
    setLang(next);
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      dir: "ltr",
      t,
      setLanguage,
      loading,
      ready: ready && Boolean(messages),
      hasSelection,
    }),
    [lang, loading, ready, hasSelection, t, messages],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
