import LoginButtons from "@/components/auth/LoginButtons";

export const dynamic = "force-static";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-8 px-4 py-10">
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-200">
          برای ادامه وارد شوید
        </p>
        <h1 className="text-4xl font-bold text-slate-50 sm:text-5xl">خوش آمدید</h1>
        <p className="text-base text-slate-400">
          با حساب گوگل یا گیت‌هاب وارد شوید. بعد از ورود، `/api/auth/me` صدا زده می‌شود تا جلسه شما
          بارگذاری و صفحات داشبورد، برنامه‌ریز، پومودورو، تایمر، چت تیمی و صوت فعال شود.
        </p>
      </div>
      <LoginButtons />
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-xs text-slate-500">
        <p className="font-semibold text-slate-300">چرا باید وارد شوید؟</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>ذخیره تایمرها، تاریخچه پومودورو و کارهای برنامه‌ریز روی بک‌اند.</li>
          <li>دریافت پیام‌های زنده تیمی از طریق SSE (`/api/events/stream`).</li>
          <li>پیوستن به اتاق‌های صوتی از طریق سیگنالینگ `wss://divtime.ir/voice`.</li>
        </ul>
      </div>
    </div>
  );
}
