import { useI18n } from "../../i18n/I18nProvider";
import type { Lang } from "../../i18n/types";

type LanguageOverlayProps = {
  open: boolean;
  onClose?: () => void;
};

const LanguageOverlay = ({ open, onClose }: LanguageOverlayProps) => {
  const { setLanguage, loading, t } = useI18n();

  const handleSelect = async (lang: Lang) => {
    if (loading) return;
    await setLanguage(lang);
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-6 sm:items-center sm:px-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[85vh] space-y-4 overflow-y-auto rounded-3xl border border-amber-400/50 bg-zinc-950/90 p-6 text-center shadow-[0_30px_120px_rgba(0,0,0,0.6)] backdrop-blur-lg sm:p-8 tv:max-w-xl tv:p-10">
        <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-28 w-28 rounded-full bg-yellow-500/20 blur-3xl" />

        <div className="relative space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">
            {t("language.choose")}
          </p>
          <p className="text-sm text-slate-300 sm:text-base">{t("language.subtitle")}</p>
        </div>

        <div className="relative grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleSelect("en")}
            disabled={loading}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-base font-semibold text-slate-100 transition hover:border-amber-400 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("language.english")}
          </button>
          <button
            type="button"
            onClick={() => handleSelect("fa")}
            disabled={loading}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-base font-semibold text-slate-100 transition hover:border-amber-400 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("language.persian")}
          </button>
        </div>

        {loading && (
          <p className="text-sm text-slate-400">{t("language.loading")}</p>
        )}
      </div>
    </div>
  );
};

export default LanguageOverlay;
