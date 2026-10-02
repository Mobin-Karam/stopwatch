'use client';

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/auth/AuthProvider";
import Button from "@/components/ui/Button";

export default function HomeRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const next = searchParams.get("next");
    if (!loading && user) {
      router.replace(next || "/dashboard");
    }
  }, [loading, router, searchParams, user]);

  if (user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-300">
        در حال انتقال به فضای کار...
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 text-center">
      <p className="rounded-full border border-amber-300/40 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-200">
        رابط کاربری دایو تایم
      </p>
      <h1 className="text-4xl font-bold text-slate-50 sm:text-5xl">
        زمان‌سنج، برنامه‌ریز، پومودورو، چت و صوت در یک رابط.
      </h1>
      <p className="max-w-2xl text-base text-slate-400">
        این فرانت‌اند Next.js به بک‌اند دایو تایم متصل است: ورود OAuth، داشبورد، برنامه‌ریز، پومودورو،
        تایمرها، چت تیمی و اتاق صوتی WebRTC. برای شروع وارد شوید.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button onClick={() => router.push("/login")}>ورود</Button>
        <Link href="/login" className="text-sm text-amber-200 underline-offset-4 hover:underline">
          ورود با گوگل یا گیت‌هاب
        </Link>
      </div>
      <a
        href="https://coffeebede.com/mobinkaram"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block w-full max-w-[468px]"
      >
        <img
          src="https://coffeebede.com/banner.svg?u=mobinkaram&bg=1a120b&fg=f5ebdd&sub=c8b49a&mbg=c8763e&mfg=1a120b&cbg=f5ebdd&bd=f5ebdd"
          width={468}
          height={100}
          alt="برام یه قهوه بخر"
          className="h-auto w-full"
        />
      </a>
    </div>
  );
}
