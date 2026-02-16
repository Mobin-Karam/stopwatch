import { useI18n } from "../../i18n/I18nProvider";

interface ComingSoonProps {
  titleKey: string;
  blurbKey: string;
}

const ComingSoon = ({ titleKey, blurbKey }: ComingSoonProps) => {
  const { t } = useI18n();

  return (
    <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center sm:p-8 tv:max-w-3xl tv:p-10">
      <div className="relative space-y-4">
        <p className="text-[11px] uppercase tracking-[0.3em] text-indigo-200/80 sm:text-xs">
          {t("coming.title")}
        </p>
        <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl tv:text-4xl">
          {t(titleKey)}
        </h1>
        <p className="text-sm text-slate-300 sm:text-base">{t(blurbKey)}</p>

        <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-dashed border-[var(--border)] bg-transparent px-4 py-3 text-xs text-slate-300 sm:text-sm">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-200">
            ☆
          </span>
          <span className="text-left">{t("coming.note")}</span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
