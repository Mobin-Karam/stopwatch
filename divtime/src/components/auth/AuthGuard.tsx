'use client';

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/auth/AuthProvider";

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const next = pathname || "/";
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-300">
        در حال بارگذاری نشست...
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
