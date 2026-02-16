import Image from "next/image";
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
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 tv:grid-cols-4">
        {plans.map((plan) => {
          const isActive = active?.planId === plan.id && active?.status === "active";
          return (
            <div
              key={plan.id}
              className={`flex h-full flex-col gap-3 rounded-2xl border p-4 ${
                isActive
                  ? "border-amber-400/70 bg-amber-500/10"
                  : "border-zinc-800 bg-zinc-900/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-50">{plan.name}</h3>
                {isActive && (
                  <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-100">
                    Active
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-slate-100 tv:text-3xl">{formatPrice(plan.amount)}</p>
              <p className="text-xs text-slate-400 sm:text-sm">
                {plan.amount === 0 ? "Free forever" : `Billed every ${plan.intervalDays || 30} days`}
              </p>
              <div className="space-y-2 text-sm text-slate-200 tv:text-base">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleClick(plan)}
                className="mt-auto rounded-xl border border-amber-400/70 bg-amber-500/15 px-3 py-2 text-sm font-semibold text-amber-100 transition hover:border-amber-300 hover:bg-amber-500/25 disabled:opacity-60"
              >
                {isActive ? "Manage" : plan.amount === 0 ? "Activate" : "Upgrade"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <a
          referrerPolicy="origin"
          target="_blank"
          rel="noreferrer"
          href="https://trustseal.enamad.ir/?id=707242&Code=EHBQU8BMbloXnxweqJxwbHPnH1yLJ33i"
        >
          <Image
            referrerPolicy="origin"
            src="https://trustseal.enamad.ir/logo.aspx?id=707242&Code=EHBQU8BMbloXnxweqJxwbHPnH1yLJ33i"
            alt="Enamad Trust Seal"
            width={120}
            height={50}
            sizes="(min-width: 1024px) 140px, 120px"
            className="h-auto w-28 cursor-pointer sm:w-32"
            data-code="EHBQU8BMbloXnxweqJxwbHPnH1yLJ33i"
          />
        </a>
      </div>
    </div>
  );
};

export default PlansGrid;
