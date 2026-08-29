import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/projects",
  "/planner",
  "/pomodoro",
  "/timers",
  "/team",
  "/voice",
  "/settings",
];

const buildAuthUrl = (request: NextRequest) => {
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "/api").replace(/\/+$/, "");
  if (apiBase.startsWith("http")) {
    return `${apiBase}/auth/me`;
  }
  return `${request.nextUrl.origin}${apiBase}/auth/me`;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === "true";
  if (!isProtected || useMocks) return NextResponse.next();

  try {
    const res = await fetch(buildAuthUrl(request), {
      headers: { cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.user) return NextResponse.next();
    }
  } catch {
    // silently fall through to redirect
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/planner/:path*",
    "/pomodoro/:path*",
    "/timers/:path*",
    "/team/:path*",
    "/voice/:path*",
    "/settings/:path*",
  ],
};
