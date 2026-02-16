export type User = {
  id: string;
  name: string;
  email: string;
  provider: "google" | "github";
  avatarColor?: string;
  theme?: "dark" | "light";
};

export type StopwatchSnapshot = {
  elapsedMs: number;
  laps: number[];
  updatedAt?: string;
};
