export type Plan = {
  id: "free" | "pro";
  name: string;
  amount: number; // IRT
  intervalDays: number;
  features: string[];
};

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    amount: 0,
    intervalDays: 0,
    features: ["Stopwatch", "Local laps", "Theme toggle"],
  },
  {
    id: "pro",
    name: "Pro",
    amount: 49000,
    intervalDays: 30,
    features: [
      "All timers (Stopwatch, Timer, Pomodoro, World Time)",
      "Cloud sync & backups",
      "Unlimited laps",
      "Early feature access",
    ],
  },
];
