'use client';
import Link from "next/link";
import type { PropsWithChildren } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/SideBar/Sidebar";
import DonationOverlay from "../components/DonationOverlay";
import type { NavItem, PageKey } from "../types/navigation";
import type { TimeMode } from "../utils/time";
import type { User } from "../auth/types";
import { useI18n } from "../i18n/I18nProvider";
import { useState } from "react";

type MobileNavProps = {
  items: NavItem[];
  activePage: PageKey;
  dir: "ltr" | "rtl";
};

const pathForPage = (page: PageKey) => (page === "stopwatch" ? "/" : `/${page}`);

const MobileNav = ({ items, activePage, dir }: MobileNavProps) => {
  const { t } = useI18n();

  return (
    <nav
      className="md:hidden border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 py-3 sm:px-6"
      dir={dir}
    >
      <div
        className={`flex gap-2 overflow-x-auto no-scrollbar ${dir === "rtl" ? "flex-row-reverse" : ""}`}
      >
        {items.map((item) => {
          const isActive = item.key === activePage;
          const href = pathForPage(item.key);
          return (
            <Link
              key={item.key}
              href={href}
              prefetch
              className={`min-w-[150px] flex-1 rounded-xl border px-3 py-2 text-left transition ${
                isActive
                  ? "border-emerald-400/70 bg-emerald-500/10 text-emerald-50"
                  : "border-[var(--border)] bg-transparent text-slate-200 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold leading-tight">
                  {t(`nav.${item.key}.label`)}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-[0.2em] ${
                    item.status === "live"
                      ? "text-emerald-300"
                      : "text-slate-500"
                  }`}
                >
                  {item.status === "live" ? t("status.live") : t("status.soon")}
                </span>
              </div>
              <p className="mt-1 text-[12px] leading-snug text-slate-400">
                {t(`nav.${item.key}.description`)}
              </p>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

type LayoutProps = PropsWithChildren<{
  navItems: NavItem[];
  activePage: PageKey;
  currentTime: string;
  timeMode: TimeMode;
  onToggleTimeMode: () => void;
  onOpenFocus: () => void;
  pageMeta: NavItem;
  user: User | null;
  onLoginRequest: () => void;
  onOpenAccount: () => void;
  dir: "ltr" | "rtl";
  theme: "dark" | "light";
  onToggleTheme: () => void;
}>;

export default function Layout({
  navItems,
  activePage,
  currentTime,
  timeMode,
  onToggleTimeMode,
  onOpenFocus,
  pageMeta,
  user,
  onLoginRequest,
  onOpenAccount,
  dir,
  theme,
  onToggleTheme,
  children,
}: LayoutProps) {
  const [donationOpen, setDonationOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[var(--bg)] text-slate-100" dir={dir}>
      <div
        className={`mx-auto flex min-h-screen max-w-6xl flex-col gap-4 px-3 py-4 sm:px-4 sm:py-6 lg:max-w-6xl lg:flex-row lg:gap-5 lg:px-6 xl:max-w-7xl 2xl:max-w-8xl tv:max-w-[110rem] ${dir === "rtl" ? "lg:flex-row-reverse" : ""}`}
      >
        <Sidebar
          items={navItems}
          activePage={activePage}
          user={user}
          onOpenAccount={onOpenAccount}
          hrefForPage={pathForPage}
        />

        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_20px_80px_rgba(0,0,0,0.25)] tv:rounded-[26px]">
          <Header
            currentTime={currentTime}
            timeMode={timeMode}
            onToggleTimeMode={onToggleTimeMode}
          onOpenFocus={onOpenFocus}
          pageMeta={pageMeta}
          user={user}
          onLoginRequest={onLoginRequest}
          onOpenAccount={onOpenAccount}
          onOpenDonation={() => setDonationOpen(true)}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />

          <MobileNav
            items={navItems}
            activePage={activePage}
            onSelectPage={onSelectPage}
            dir={dir}
          />

          <main className="flex flex-1 items-start justify-center overflow-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>

          <Footer />
        </div>

        <DonationOverlay open={donationOpen} onClose={() => setDonationOpen(false)} />
      </div>
    </div>
  );
}
