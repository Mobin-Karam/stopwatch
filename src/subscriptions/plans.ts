export type Plan = {
  id: "basic" | "pro" | "team";
  name: string;
  amount: number; // IRT
  intervalDays: number;
  features: string[];
};

export const plans: Plan[] = [
  { id: "basic", name: "Basic", amount: 0, intervalDays: 0, features: ["Stopwatch"] },
  { id: "pro", name: "Pro", amount: 50000, intervalDays: 30, features: ["Timer", "Pomodoro", "Stopwatch"] },
  { id: "team", name: "Team", amount: 120000, intervalDays: 30, features: ["All features", "Shared settings"] },
];
