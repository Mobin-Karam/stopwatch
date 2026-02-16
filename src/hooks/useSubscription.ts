import { useCallback, useEffect, useState } from "react";
import { plans, type Plan } from "../subscriptions/plans";

type Subscription = {
  planId: string;
  status: "none" | "pending" | "active" | "canceled" | "failed";
  authority?: string;
  refId?: string;
  expiresAt?: string;
};

type UseSubscriptionReturn = {
  plans: Plan[];
  active: Subscription | null;
  loading: boolean;
  start: (planId: Plan["id"]) => Promise<void>;
  refresh: () => Promise<void>;
};

export const useSubscription = (): UseSubscriptionReturn => {
  const [active, setActive] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscriptions/plans", { credentials: "include" });
      const data = await res.json();
      setActive(data.active ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const start = useCallback(async (planId: Plan["id"]) => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscriptions/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.free) {
        await load();
      } else if (data.redirect) {
        window.location.href = data.redirect;
      }
    } finally {
      setLoading(false);
    }
  }, [load]);

  return { plans, active, loading, start, refresh: load };
};
