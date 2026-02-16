import type { NavItem } from "../../types/navigation";
import type { TimeMode } from "../../utils/time";
import { useI18n } from "../../i18n/I18nProvider";
import type { User } from "../../auth/types";

type HeaderProps = {
  currentTime: string;
  timeMode: TimeMode;
  onToggleTimeMode: () => void;
  onOpenFocus: () => void;
  pageMeta: NavItem;
  user: User | null;
  onLoginRequest: () => void;
  onOpenAccount: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

const Header = ({
  currentTime,
  timeMode,
  onToggleTimeMode,
  onOpenFocus,
  pageMeta,
  user,
  onLoginRequest,
  onOpenAccount,
  theme,
  onToggleTheme,
}: HeaderProps) => {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/60 bg-transparent text-lg font-semibold text-emerald-50">
          TM
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            {t("brand.name")}
          </p>
          <h1 className="text-lg font-semibold text-slate-100">
            {t(`nav.${pageMeta.key}.label`)}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleTimeMode}
          className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-slate-100 transition hover:border-emerald-500/60"
        >
          <span className="rounded-full bg-slate-700 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-200">
            {timeMode}h
          </span>
          <span className="font-mono" suppressHydrationWarning>
            {currentTime}
          </span>
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-slate-100 transition hover:border-emerald-500/60"
        >
          <span className="rounded-full bg-slate-700 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-200">
            {theme}
          </span>
          <span>{theme === "dark" ? "Dark" : "Light"}</span>
        </button>

        <button
          type="button"
          onClick={onOpenFocus}
          className="rounded-full border border-indigo-400/60 bg-transparent px-4 py-2 text-sm font-semibold text-indigo-100 transition hover:border-indigo-300"
        >
          {t("header.focus")}
        </button>

        {user ? (
          <button
            type="button"
            onClick={onOpenAccount}
            className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-transparent px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
          >
            <span className="rounded-full bg-slate-700 px-2 py-1 text-xs uppercase">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
            <span>{user.name}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onLoginRequest}
            className="rounded-full border border-emerald-400/60 bg-transparent px-4 py-2 text-sm font-semibold text-emerald-50 transition hover:border-emerald-300"
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
