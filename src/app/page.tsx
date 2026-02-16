'use client';

import { useState } from "react";
import Layout from "../Layout/main";
import StopWatch from "../components/StopWatch";
import ComingSoon from "../components/ComingSoon";
import FocusOverlay from "../components/FocusOverlay";
import LanguageOverlay from "../components/LanguageOverlay";
import AccountOverlay from "../components/AccountOverlay";
import { NAV_ITEMS, PAGE_COPY } from "../config/pages";
import { useClock } from "../hooks/useClock";
import { useNavigation } from "../hooks/useNavigation";
import { useI18n } from "../i18n/I18nProvider";
import { useAuth } from "../auth/AuthProvider";
import type { PageKey } from "../types/navigation";

export default function HomePage() {
  const { activePage, setActivePage, activeNav } = useNavigation({ items: NAV_ITEMS });
  const { formatted: currentTime, mode: timeMode, toggleMode } = useClock({ initialMode: "24" });
  const [focusOpen, setFocusOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { ready, hasSelection, dir } = useI18n();
  const { user, theme, setTheme } = useAuth();

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
        onSelectPage={setActivePage}
        timeMode={timeMode}
        onToggleTimeMode={toggleMode}
        currentTime={currentTime}
        onOpenFocus={() => setFocusOpen(true)}
        pageMeta={activeNav}
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
