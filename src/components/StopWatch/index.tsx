import { useEffect, useMemo } from "react";
import { useStopwatch, formatDisplay, formatTimeParts } from "@time/core";
import Button from "../Button";
import Lab from "../Lab";
import { useI18n } from "../../i18n/I18nProvider";
import { useAuth } from "../../auth/AuthProvider";

const StopWatch = () => {
  const {
    elapsedMs,
    laps,
    isRunning,
    isPaused,
    start,
    pause,
    reset,
    lap,
    setSnapshot,
    snapshot,
  } = useStopwatch({ tickMs: 10 });
  const { t } = useI18n();
  const { user, saveStopwatch, loadStopwatch } = useAuth();

  const time = useMemo(() => formatTimeParts(elapsedMs), [elapsedMs]);

  const primaryButtonLabel = isRunning
    ? t("stopwatch.pause")
    : isPaused
    ? t("stopwatch.resume")
    : t("stopwatch.start");
  const secondaryButtonLabel = isPaused ? t("stopwatch.reset") : t("stopwatch.lap");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const snapshot = await loadStopwatch();
      if (snapshot) {
        setSnapshot(snapshot);
      }
    })();
  }, [user, loadStopwatch, setSnapshot]);

  useEffect(() => {
    if (!user) return;
    if (isPaused) {
      saveStopwatch(snapshot());
    }
  }, [isPaused, snapshot, saveStopwatch, user]);

  const handleLap = () => {
    const snap = lap();
    if (user && snap) saveStopwatch(snap);
  };

  const handleReset = () => {
    const snap = reset();
    if (user) saveStopwatch(snap);
  };

  return (
    <div className="relative w-full max-w-2xl space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{t("stopwatch.session")}</span>
          <span className="rounded-full border border-amber-500/40 bg-transparent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">
            {t("stopwatch.live")}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-center gap-3 font-mono text-6xl sm:text-7xl">
          <span className={isRunning ? "text-blue-200" : "text-slate-100"}>
            {time.hours}
          </span>
          <span className="text-slate-500">:</span>
          <span className={isRunning || isPaused ? "text-blue-200" : "text-slate-100"}>
            {time.minutes}
          </span>
          <span className="text-slate-500">:</span>
          <span className={isRunning || isPaused ? "text-blue-200" : "text-slate-100"}>
            {time.seconds}
          </span>
          <span className="text-slate-500">.</span>
          <span className={isRunning || isPaused ? "text-blue-200" : "text-slate-100"}>
            {time.centiseconds}
          </span>
        </div>

        <p className="mt-3 text-center text-sm text-slate-400">{t("stopwatch.description")}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            onClickHandle={isRunning ? pause : start}
            buttonName={primaryButtonLabel}
            className={`flex-1 rounded-2xl border px-5 py-3 text-lg font-semibold transition-all duration-200 ${
              isRunning
                ? "border-amber-500/60 bg-transparent text-amber-100 hover:border-amber-400"
                : "border-blue-500/60 bg-transparent text-blue-100 hover:border-blue-400"
            }`}
          />

          <Button
            onClickHandle={isPaused ? handleReset : handleLap}
            buttonName={secondaryButtonLabel}
            disabled={!isRunning && !isPaused}
            className={`flex-1 rounded-2xl border px-5 py-3 text-lg font-semibold transition-all duration-200 ${
              isPaused
                ? "border-rose-500/50 bg-transparent text-rose-100 hover:border-rose-400"
                : isRunning
                ? "border-slate-600 bg-transparent text-slate-100 hover:border-slate-500"
                : "cursor-not-allowed border-[var(--border)] bg-transparent text-slate-500"
            }`}
          />
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>{t("stopwatch.laps")}</span>
          <span className="text-xs text-slate-500">{t("stopwatch.saved", { count: laps.length })}</span>
        </div>

        {laps.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-transparent px-4 py-6 text-center text-sm text-slate-500">
            {t("stopwatch.noLaps")}
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {laps.map((lap, index) => (
              <Lab
                key={lap + index}
                id={laps.length - index}
                labData={formatDisplay(lap)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StopWatch;
