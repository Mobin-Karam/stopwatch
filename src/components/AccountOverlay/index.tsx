import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { useI18n } from "../../i18n/I18nProvider";
import PlansGrid from "../Subscription/PlansGrid";

type AccountOverlayProps = {
  open: boolean;
  onClose: () => void;
};

const AccountOverlay = ({ open, onClose }: AccountOverlayProps) => {
  const { user, loginGoogle, loginGithub, logout, updateProfile, setTheme: persistTheme } = useAuth();
  const { t } = useI18n();
  const [name, setName] = useState(user?.name ?? "");
  const [theme, setTheme] = useState<"dark" | "light">(user?.theme ?? "dark");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name ?? "");
    setTheme(user?.theme ?? "dark");
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile({ name });
      await persistTheme(theme);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-6 sm:items-center sm:px-6">
      <div
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl max-h-[90vh] space-y-5 overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900/95 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.6)] backdrop-blur-lg sm:p-7 tv:max-w-2xl tv:p-9">
        <div className="absolute -left-14 -top-14 h-32 w-32 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-28 w-28 rounded-full bg-emerald-400/15 blur-3xl" />

        {!user ? (
          <div className="relative space-y-4 text-center">
            <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">Log in</h2>
            <p className="text-sm text-slate-300 sm:text-base">{t("user.signin")}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={loginGoogle}
                className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-400 hover:bg-slate-800"
              >
                Continue with Google
              </button>
              <button
                type="button"
                onClick={loginGithub}
                className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-400 hover:bg-slate-800"
              >
                Continue with GitHub
              </button>
            </div>
          </div>
        ) : (
          <div className="relative space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Account</p>
                <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">{user.name}</h2>
                <p className="text-sm text-slate-400">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-rose-400 hover:text-rose-200"
              >
                Logout
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Display name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Theme</label>
              <div className="grid grid-cols-2 gap-3">
                {["dark", "light"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTheme(mode as "dark" | "light")}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      theme === mode
                        ? "border-emerald-400 bg-emerald-500/10 text-emerald-100"
                        : "border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-600"
                    }`}
                  >
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={loginGoogle}
                className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-indigo-400 hover:bg-slate-800"
              >
                Switch Google account
              </button>
              <button
                type="button"
                onClick={loginGithub}
                className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-indigo-400 hover:bg-slate-800"
              >
                Switch GitHub account
              </button>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-600"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-2xl border border-emerald-400/60 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-50 shadow-[0_0_18px_rgba(16,185,129,0.25)] transition hover:border-emerald-300 hover:bg-emerald-500/25 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Subscription</p>
                  <h3 className="text-lg font-semibold text-slate-50">Choose your plan</h3>
                </div>
              </div>
              <PlansGrid onNeedLogin={loginGoogle} isAuthenticated={Boolean(user)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountOverlay;
