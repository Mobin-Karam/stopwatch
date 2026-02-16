# DivTime – Production Checklist

## Environments
- `.env.production` (frontend)  
  - `NEXT_PUBLIC_API_BASE=/api`  
  - `API_PROXY_ORIGIN=https://divtimebackend.liara.run` (or your backend host)
- `.env.development` for local override (e.g., `http://localhost:4000`)

## Backend expectations
- Exposes REST at `/api/*` and implements GitHub/Google OAuth callbacks at `/api/auth/{provider}/callback`.
- Must send/accept cookies (`Set-Cookie` with `Secure`, `HttpOnly`, `SameSite=None`) so the frontend’s fetch calls with `credentials: "include"` work.
- Should implement `state` + PKCE for OAuth and verify `redirect_uri` matches the registered callback (`https://divtime.ir/api/auth/github/callback`).

## Frontend build & run
```bash
npm ci
npm run build   # builds core package then Next app
npm start       # serves production build
```

## Liara deployment (Next platform)
- `liara.json` is configured for `"platform": "next"` and proxies `/api/*` to `https://divtimebackend.liara.run/api/*`.
- Push with `liara deploy` or CI; ensure env vars above are set in Liara dashboard.

## Production checks
- Lighthouse ≥90 for PWA/SEO/Perf on https://divtime.ir.
- `manifest.webmanifest` loads and icons resolve.
- Service worker registered (Application > Service Workers).
- OAuth roundtrip: click “Login with GitHub”, authorize, land on `/api/auth/github/callback`, session cookie set, redirected back to app, user info loads.

## Optional hardening
- Add CSP headers on the hosting layer (example):  
  `default-src 'self'; img-src 'self' data: https://trustseal.enamad.ir; connect-src 'self' https://divtimebackend.liara.run; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:;`
- Set `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: geolocation=(), microphone=()`.
