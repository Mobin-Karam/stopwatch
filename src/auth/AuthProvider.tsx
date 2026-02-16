import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { StopwatchSnapshot, User } from "./types";
import { withCredentialsFetch } from "../utils/http";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  loginGoogle: () => void;
  loginGithub: () => void;
  logout: () => Promise<void>;
  updateProfile: (payload: Partial<Pick<User, "name" | "theme">>) => Promise<void>;
  saveStopwatch: (snapshot: StopwatchSnapshot) => Promise<void>;
  loadStopwatch: () => Promise<StopwatchSnapshot | null>;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await withCredentialsFetch("/api/user/me");
        const data = await res.json();
        setUser(data.user ?? null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const nextTheme = user?.theme ?? theme;
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
  }, [user, theme]);

  const loginGoogle = useCallback(() => {
    window.location.href = "/api/auth/google";
  }, []);

  const loginGithub = useCallback(() => {
    window.location.href = "/api/auth/github";
  }, []);

  const logout = useCallback(async () => {
    await withCredentialsFetch("/api/auth/logout", { method: "GET" });
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (payload: Partial<Pick<User, "name" | "theme">>) => {
      const res = await withCredentialsFetch("/api/user/preferences", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setUser(data.user);
    },
    [],
  );

  const setTheme = useCallback(
    async (next: "dark" | "light") => {
      if (user) {
        await updateProfile({ theme: next });
      } else {
        setThemeState(next);
        localStorage.setItem("theme", next);
        document.documentElement.dataset.theme = next;
      }
    },
    [updateProfile, user],
  );

  const saveStopwatch = useCallback(async (snapshot: StopwatchSnapshot) => {
    if (!user) return;
    await withCredentialsFetch("/api/user/stopwatch", {
      method: "POST",
      body: JSON.stringify(snapshot),
    });
  }, [user]);

  const loadStopwatch = useCallback(async () => {
    if (!user) return null;
    const res = await withCredentialsFetch("/api/user/stopwatch");
    const data = await res.json();
    return data.lastStopwatch ?? null;
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      loginGoogle,
      loginGithub,
      logout,
      updateProfile,
      saveStopwatch,
      loadStopwatch,
      theme: user?.theme ?? theme,
      setTheme,
    }),
    [
      user,
      loading,
      loginGoogle,
      loginGithub,
      logout,
      updateProfile,
      saveStopwatch,
      loadStopwatch,
      theme,
      setTheme,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
