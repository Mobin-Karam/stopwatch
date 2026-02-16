import type { NavItem, PageKey } from "../types/navigation";

export const NAV_ITEMS: NavItem[] = [
  { key: "stopwatch", label: "Stopwatch", status: "live", description: "Precision laps" },
  { key: "timer", label: "Timer", status: "soon", description: "Countdown blocks" },
  { key: "world-time", label: "World Time", status: "soon", description: "Cities grid" },
  { key: "daily-planner", label: "Daily Planner", status: "soon", description: "Time blocks" },
  { key: "pomodoro", label: "Pomodoro", status: "soon", description: "Focus sprints" },
  { key: "timezone", label: "Timezone", status: "soon", description: "Offsets map" },
];

export const PAGE_COPY: Record<PageKey, { titleKey: string; blurbKey: string }> = {
  stopwatch: { titleKey: "page.stopwatch.title", blurbKey: "page.stopwatch.blurb" },
  timer: { titleKey: "page.timer.title", blurbKey: "page.timer.blurb" },
  "world-time": { titleKey: "page.world-time.title", blurbKey: "page.world-time.blurb" },
  "daily-planner": { titleKey: "page.daily-planner.title", blurbKey: "page.daily-planner.blurb" },
  pomodoro: { titleKey: "page.pomodoro.title", blurbKey: "page.pomodoro.blurb" },
  timezone: { titleKey: "page.timezone.title", blurbKey: "page.timezone.blurb" },
};
