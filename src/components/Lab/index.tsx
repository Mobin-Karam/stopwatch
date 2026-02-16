import { useI18n } from "../../i18n/I18nProvider";

interface LabProps {
  labData: string;
  id: number;
}

const Lab = ({ labData, id }: LabProps) => {
  const { t } = useI18n();

  return (
    <div className="flex w-full items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 shadow-sm">
      <div className="font-mono text-base text-slate-50">{labData}</div>
      <span className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs uppercase tracking-wide text-slate-400">
        {t("stopwatch.lapLabel", { id })}
      </span>
    </div>
  );
};

export default Lab;
