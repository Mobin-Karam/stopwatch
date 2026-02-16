import type { PropsWithChildren } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/SideBar/Sidebar";
import type { NavItem, PageKey } from "../types/navigation";
import type { TimeMode } from "../utils/time";
import type { User } from "../auth/types";

type LayoutProps = PropsWithChildren<{
  navItems: NavItem[];
  activePage: PageKey;
  onSelectPage: (key: PageKey) => void;
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
  onSelectPage,
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
  return (
    <div className="min-h-screen bg-[var(--bg)] text-slate-100">
      <div
        className={`mx-auto flex min-h-screen max-w-6xl gap-4 px-4 py-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
      >
        <Sidebar
          items={navItems}
          activePage={activePage}
          onSelectPage={onSelectPage}
          user={user}
          onOpenAccount={onOpenAccount}
        />

        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Header
          currentTime={currentTime}
          timeMode={timeMode}
          onToggleTimeMode={onToggleTimeMode}
          onOpenFocus={onOpenFocus}
          pageMeta={pageMeta}
          user={user}
          onLoginRequest={onLoginRequest}
          onOpenAccount={onOpenAccount}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />

          <main className="flex flex-1 items-center justify-center p-6">
            {children}
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
