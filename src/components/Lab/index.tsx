import { useI18n } from "../../i18n/I18nProvider";

interface LabProps {
  labData: string;
  id: number;
}

const Lab = ({ labData, id }: LabProps) => {
  const { t } = useI18n();

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800/80 bg-slate-900/70 px-4 py-3 text-xs text-slate-100 shadow-sm sm:text-sm tv:px-5 tv:py-4">
      <div className="font-mono text-lg text-slate-50 sm:text-xl">{labData}</div>
      <span className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-400 sm:text-xs">
        {t("stopwatch.lapLabel", { id })}
      </span>
    </div>
  );
};

export default Lab;
