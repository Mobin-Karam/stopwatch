export type PageKey =
  | "stopwatch"
  | "timer"
  | "world-time"
  | "daily-planner"
  | "pomodoro"
  | "timezone";

export type NavItem = {
  key: PageKey;
  label: string;
  status: "live" | "soon";
  description?: string;
};
