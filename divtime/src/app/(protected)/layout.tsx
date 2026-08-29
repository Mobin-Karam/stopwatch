// Client layout because we wrap everything with AuthGuard/AppShell (client components)
'use client';

import type { ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";
import AuthGuard from "@/components/auth/AuthGuard";
import { primaryNav, secondaryNav } from "@/config/nav";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppShell navPrimary={primaryNav} navSecondary={secondaryNav}>
        {children}
      </AppShell>
    </AuthGuard>
  );
}
