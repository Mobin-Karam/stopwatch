import { useI18n } from "../../i18n/I18nProvider";
import type { Lang } from "../../i18n/types";

type LanguageOverlayProps = {
  open: boolean;
};

const LanguageOverlay = ({ open }: LanguageOverlayProps) => {
  const { setLanguage, loading, t } = useI18n();

  const handleSelect = async (lang: Lang) => {
    if (loading) return;
    await setLanguage(lang);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" aria-hidden />

      <div className="relative w-full max-w-lg space-y-4 overflow-hidden rounded-3xl border border-emerald-400/40 bg-slate-900/90 p-8 text-center shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-lg">
        <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-28 w-28 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">
            {t("language.choose")}
          </p>
          <p className="text-slate-300">{t("language.subtitle")}</p>
        </div>

        <div className="relative grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleSelect("en")}
            disabled={loading}
            className="rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-base font-semibold text-slate-100 transition hover:border-emerald-400 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("language.english")}
          </button>
          <button
            type="button"
            onClick={() => handleSelect("fa")}
            disabled={loading}
            className="rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-base font-semibold text-slate-100 transition hover:border-emerald-400 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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
