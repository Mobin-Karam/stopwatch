import type { NavItem } from "../../types/navigation";
import type { TimeMode } from "../../utils/time";
import { useI18n } from "../../i18n/I18nProvider";
import type { User } from "../../auth/types";

type HeaderProps = {
  currentTime: string;
  timeMode: TimeMode;
  onToggleTimeMode: () => void;
  onOpenFocus: () => void;
  onOpenLanguage: () => void;
  pageMeta: NavItem;
  user: User | null;
  onLoginRequest: () => void;
  onOpenAccount: () => void;
  onOpenDonation: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

const Header = ({
  currentTime,
  timeMode,
  onToggleTimeMode,
  onOpenFocus,
  onOpenLanguage,
  pageMeta,
  user,
  onLoginRequest,
  onOpenAccount,
  onOpenDonation,
  theme,
  onToggleTheme,
}: HeaderProps) => {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-400/70 bg-transparent text-base font-semibold text-amber-200 sm:h-11 sm:w-11 sm:text-lg tv:h-12 tv:w-12 tv:text-xl">
            TM
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 sm:text-xs">
            {t("brand.name")}
          </p>
            <h1 className="text-base font-semibold text-slate-100 sm:text-lg tv:text-xl">
            {t(`nav.${pageMeta.key}.label`)}
          </h1>
        </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:justify-end">
          <button
            type="button"
            onClick={onToggleTimeMode}
            className="flex w-full items-center justify-between gap-2 rounded-full border border-[var(--border)] bg-transparent px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-amber-500/60 sm:w-auto sm:text-sm tv:px-4 tv:py-3"
          >
            <span className="rounded-full bg-slate-700 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-200 sm:text-xs">
              {timeMode}h
            </span>
            <span className="font-mono text-sm sm:text-base tv:text-lg" suppressHydrationWarning>
              {currentTime}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="flex w-full items-center justify-between gap-2 rounded-full border border-[var(--border)] bg-transparent px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-amber-500/60 sm:w-auto sm:text-sm tv:px-4 tv:py-3"
          >
            <span className="rounded-full bg-slate-700 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-200 sm:text-xs">
              {theme}
            </span>
            <span className="capitalize sm:text-sm">{theme === "dark" ? "Dark" : "Light"}</span>
          </button>

          <button
            type="button"
            onClick={onOpenFocus}
            className="w-full rounded-full border border-[var(--border)] bg-zinc-900/80 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-amber-400 sm:w-auto sm:text-sm tv:px-5 tv:py-3"
          >
            {t("header.focus")}
          </button>

          <button
            type="button"
            onClick={onOpenLanguage}
            className="w-full rounded-full border border-[var(--border)] bg-transparent px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-amber-400 sm:w-auto sm:text-sm tv:px-5 tv:py-3"
          >
            {t("language.choose")}
          </button>

          <button
            type="button"
            onClick={onOpenDonation}
            className="w-full rounded-full border border-amber-400/70 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-100 transition hover:border-amber-300 sm:w-auto sm:text-sm tv:px-5 tv:py-3"
          >
            Donate
          </button>

          {user ? (
            <button
              type="button"
              onClick={onOpenAccount}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-transparent px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-amber-400 sm:w-auto sm:justify-start sm:text-sm tv:px-4 tv:py-3"
            >
              <span className="rounded-full bg-slate-700 px-2 py-1 text-xs uppercase">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="truncate">{user.name}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onLoginRequest}
              className="w-full rounded-full border border-amber-400/70 bg-transparent px-4 py-2 text-xs font-semibold text-amber-100 transition hover:border-amber-300 sm:w-auto sm:text-sm tv:px-5 tv:py-3"
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
