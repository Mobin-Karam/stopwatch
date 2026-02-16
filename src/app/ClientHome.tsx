'use client';

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Layout from "../Layout/main";
import StopWatch from "../components/StopWatch";
import ComingSoon from "../components/ComingSoon";
import FocusOverlay from "../components/FocusOverlay";
import LanguageOverlay from "../components/LanguageOverlay";
import AccountOverlay from "../components/AccountOverlay";
import { NAV_ITEMS, PAGE_COPY } from "../config/pages";
import { useClock } from "../hooks/useClock";
import { useI18n } from "../i18n/I18nProvider";
import { useAuth } from "../auth/AuthProvider";
import type { PageKey } from "../types/navigation";

const pageFromPathname = (pathname: string): PageKey | null => {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/") return "stopwatch";
  const slug = clean.slice(1);
  return NAV_ITEMS.find((item) => item.key === slug)?.key ?? null;
};

export default function ClientHome({ initialPage }: { initialPage: PageKey }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { formatted: currentTime, mode: timeMode, toggleMode } = useClock({ initialMode: "24" });
  const [focusOpen, setFocusOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { ready, hasSelection, dir } = useI18n();
  const { user, theme, setTheme } = useAuth();

  const activePage = useMemo(
    () => pageFromPathname(pathname) ?? initialPage,
    [pathname, initialPage],
  );

  const renderPage = (page: PageKey) => {
    if (page === "stopwatch") return <StopWatch />;

    const data = PAGE_COPY[page];
    return <ComingSoon titleKey={data.titleKey} blurbKey={data.blurbKey} />;
  };

  return (
    <>
      <Layout
        navItems={NAV_ITEMS}
        activePage={activePage}
        timeMode={timeMode}
        onToggleTimeMode={toggleMode}
        currentTime={currentTime}
        onOpenFocus={() => setFocusOpen(true)}
        pageMeta={NAV_ITEMS.find((item) => item.key === activePage) ?? NAV_ITEMS[0]}
        user={user}
        onLoginRequest={() => setAccountOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
        dir={dir}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {renderPage(activePage)}
      </Layout>

      <FocusOverlay open={focusOpen} onClose={() => setFocusOpen(false)} />
      <LanguageOverlay open={!hasSelection || !ready} />
      <AccountOverlay open={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  );
}
