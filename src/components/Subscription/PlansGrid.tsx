import { useSubscription } from "../../hooks/useSubscription";
import type { Plan } from "../../subscriptions/plans";

type PlansGridProps = {
  onNeedLogin: () => void;
  isAuthenticated: boolean;
};

const formatPrice = (amount: number) => {
  if (amount === 0) return "Free";
  return `${amount.toLocaleString("fa-IR")} تومان`;
};

const PlansGrid = ({ onNeedLogin, isAuthenticated }: PlansGridProps) => {
  const { plans, active, loading, start } = useSubscription();

  const handleClick = (plan: Plan) => {
    if (!isAuthenticated) {
      onNeedLogin();
      return;
    }
    start(plan.id);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {plans.map((plan) => {
        const isActive = active?.planId === plan.id && active?.status === "active";
        return (
          <div
            key={plan.id}
            className={`flex h-full flex-col gap-3 rounded-2xl border p-4 ${
              isActive
                ? "border-emerald-400/60 bg-emerald-500/10"
                : "border-slate-800 bg-slate-900/70"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-50">{plan.name}</h3>
              {isActive && (
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                  Active
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-slate-100">{formatPrice(plan.amount)}</p>
            <p className="text-xs text-slate-400">Billed every {plan.intervalDays || 0} days</p>
            <div className="space-y-2 text-sm text-slate-200">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleClick(plan)}
              className="mt-auto rounded-xl border border-indigo-400/60 bg-indigo-500/15 px-3 py-2 text-sm font-semibold text-indigo-100 transition hover:border-indigo-300 hover:bg-indigo-500/25 disabled:opacity-60"
            >
              {isActive ? "Manage" : plan.amount === 0 ? "Activate" : "Upgrade"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PlansGrid;
