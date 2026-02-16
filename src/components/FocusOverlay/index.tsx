import { useI18n } from "../../i18n/I18nProvider";

type FocusOverlayProps = {
  open: boolean;
  onClose: () => void;
};

const FocusOverlay = ({ open, onClose }: FocusOverlayProps) => {
  const { t } = useI18n();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        <div className="relative space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/80">
            {t("header.focus")}
          </p>
          <h2 className="text-2xl font-semibold text-slate-50">{t("focus.title")}</h2>
          <p className="text-slate-300">{t("focus.body")}</p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
            >
              {t("focus.close")}
            </button>
            <a
              href="https://forms.gle/WY5Zfeedback"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-indigo-400/60 bg-transparent px-4 py-2 text-sm font-semibold text-indigo-50 transition hover:border-indigo-300"
            >
              {t("focus.feedback")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusOverlay;
