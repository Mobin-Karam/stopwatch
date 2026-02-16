import { useState } from "react";
import { apiUrl } from "../../utils/http";
import { useAuth } from "../../auth/AuthProvider";

type DonationOverlayProps = {
  open: boolean;
  onClose: () => void;
};

const DonationOverlay = ({ open, onClose }: DonationOverlayProps) => {
  const { user, loginGoogle } = useAuth();
  const [amount, setAmount] = useState(50000);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (amount <= 0) {
      setMessage("لطفا مبلغ معتبر وارد کنید.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(apiUrl("/api/donations/request"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount, note }),
      });
      const data = await res.json();
      if (data.redirect) {
        window.location.href = data.redirect;
        return;
      }
      if (data.ok) {
        setMessage("ممنون از حمایت شما! پرداخت ثبت شد.");
      } else {
        setMessage("خطا در ثبت پرداخت. دوباره تلاش کنید.");
      }
    } catch (err) {
      console.error(err);
      setMessage("اتصال برقرار نشد. بعدا تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-6 sm:items-center sm:px-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[85vh] space-y-5 overflow-y-auto rounded-3xl border border-amber-400/50 bg-zinc-950/95 p-5 shadow-[0_30px_140px_rgba(0,0,0,0.6)] backdrop-blur-lg sm:p-7 tv:max-w-xl tv:p-9">
        <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-amber-400/18 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-28 w-28 rounded-full bg-yellow-500/18 blur-3xl" />

        <div className="relative space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">Donate</p>
          <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">حمایت از تایم</h2>
          <p className="text-sm text-slate-300 sm:text-base">
            با هر مبلغی که دوست دارید از توسعه ابزارهای رایگان حمایت کنید.
          </p>
        </div>

        {!user && (
          <button
            type="button"
            onClick={loginGoogle}
            className="w-full rounded-2xl border border-amber-400/70 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-100 transition hover:border-amber-300"
          >
            ورود سریع با گوگل برای ثبت رسید
          </button>
        )}

        <div className="relative space-y-3">
          <label className="text-sm text-slate-300">مبلغ (تومان)</label>
          <input
            type="number"
            min={1000}
            step={1000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-base text-slate-100 outline-none focus:border-amber-400"
            placeholder="مثلا 50000"
          />
          <div className="flex flex-wrap gap-2">
            {[20000, 50000, 100000, 200000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  amount === preset
                    ? "border-amber-400 bg-amber-500/15 text-amber-100"
                    : "border-zinc-800 bg-zinc-900 text-slate-200 hover:border-zinc-700"
                }`}
              >
                {preset.toLocaleString("fa-IR")}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-300">یادداشت (اختیاری)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-amber-400"
            placeholder="دلیل حمایت یا پیام شما"
          />
        </div>

        {message && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm text-slate-200">
            {message}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-zinc-700"
          >
            بستن
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-2xl border border-amber-400/70 bg-amber-500/15 px-5 py-2 text-sm font-semibold text-amber-100 shadow-[0_0_18px_rgba(250,204,21,0.3)] transition hover:border-amber-300 hover:bg-amber-500/25 disabled:opacity-60"
          >
            {loading ? "در حال هدایت..." : "پرداخت امن"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationOverlay;
