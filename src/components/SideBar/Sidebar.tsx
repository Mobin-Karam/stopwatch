import type { NavItem, PageKey } from "../../types/navigation";
import type { User } from "../../auth/types";
import { useI18n } from "../../i18n/I18nProvider";

type SidebarProps = {
  items: NavItem[];
  activePage: PageKey;
  onSelectPage: (key: PageKey) => void;
  user: User | null;
  onOpenAccount: () => void;
};

const getInitials = (name?: string) => {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const Sidebar = ({ items, activePage, onSelectPage, user, onOpenAccount }: SidebarProps) => {
  const { t } = useI18n();

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-slate-200 md:flex">
      <div className="space-y-5">
        <div className="rounded-xl border border-[var(--border)] bg-transparent p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/80">
            {t("sidebar.tag")}
          </p>
          <h2 className="mt-2 text-xl font-semibold">{t("sidebar.title")}</h2>
          <p className="text-sm text-slate-400">{t("sidebar.copy")}</p>
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const isActive = item.key === activePage;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelectPage(item.key)}
                className={`group flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition ${
                  isActive
                    ? "border-emerald-400 bg-transparent text-emerald-100"
                    : "border-[var(--border)] bg-transparent text-slate-200 hover:border-slate-500"
                }`}
              >
                <div className="space-y-0.5">
                  <span className="font-semibold">{t(`nav.${item.key}.label`)}</span>
                  <p className="text-xs text-slate-400">{t(`nav.${item.key}.description`)}</p>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-[0.2em] ${
                    item.status === "live"
                      ? "text-emerald-300"
                      : "text-slate-500 group-hover:text-slate-300"
                  }`}
                >
                  {item.status === "live" ? t("status.live") : t("status.soon")}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={onOpenAccount}
        className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-transparent p-3 text-left text-sm text-slate-100 transition hover:border-slate-500"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-base font-bold text-slate-100">
          {getInitials(user?.name)}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-50">
            {user?.name ?? t("user.guest")}
          </span>
          <span className="text-xs text-slate-300">
            {user ? user.email : t("user.signin")}
          </span>
        </div>
      </button>
    </aside>
  );
};

export default Sidebar;
