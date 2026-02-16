import { useI18n } from "../../i18n/I18nProvider";

interface ComingSoonProps {
  titleKey: string;
  blurbKey: string;
}

const ComingSoon = ({ titleKey, blurbKey }: ComingSoonProps) => {
  const { t } = useI18n();

  return (
    <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
      <div className="relative space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/80">{t("coming.title")}</p>
        <h1 className="text-3xl font-semibold text-slate-50">{t(titleKey)}</h1>
        <p className="text-slate-300">{t(blurbKey)}</p>

        <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-dashed border-[var(--border)] bg-transparent px-4 py-3 text-sm text-slate-300">
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
