# Time Backend

NestJS service that provides authentication (Google/GitHub OAuth), user preferences, stopwatch persistence, subscriptions/donations via Zarinpal, world-clock and time conversion tools, pomodoro tracking, planner tasks, timer history, projects, dashboards, and data export. The API is mounted under `/api` and uses session-based authentication backed by MongoDB.

## Stack
- Node.js 20+ (engines pinned)
- NestJS 11, Express, Passport (sessions)
- MongoDB (users + session store)
- Zarinpal payment gateway

## Environment
Copy `.env.example` to `.env` and fill in production values:
- `APP_BASE_URL` — public base URL of this backend (used in OAuth and payment callbacks).
- `FRONTEND_ORIGIN` — comma-separated list of allowed frontend origins for CORS.
- `MONGO_URI` — MongoDB connection string (used for data + sessions).
- `SESSION_SECRET` — strong secret for signed cookies.
- `COOKIE_DOMAIN` — optional, set when serving behind a shared domain.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
- `ZARINPAL_MERCHANT_ID`
- `PORT`, `NODE_ENV`

## Running locally
1) `npm install`
2) Start MongoDB (`MONGO_URI` default is `mongodb://localhost:27017/time`).
3) `npm run start:dev`

Key endpoints (all under `/api`):
- Health: `GET /api`, `GET /api/health`, `GET /healthz`
- Auth/User: `GET /api/user/me`, `POST /api/user/preferences`, `GET/POST /api/user/stopwatch`
- Subscriptions: `POST /api/subscriptions/request`, `GET /api/subscriptions/verify`, `GET /api/subscriptions/plans`
- Donations: `POST /api/donations/request`, `GET /api/donations/callback`
- Time tools: `GET /api/time/world-clock`, `GET /api/time/convert?time=...&zones=...`, `GET /api/time/zones`
- Pomodoro: `POST /api/pomodoro/start`, `POST /api/pomodoro/complete/:id`, `POST /api/pomodoro/cancel/:id`, `GET /api/pomodoro/recent`, `GET /api/pomodoro/summary`
- Planner: `POST /api/planner/tasks`, `GET /api/planner/tasks?date=YYYY-MM-DD`, `PATCH /api/planner/tasks/:id`, `DELETE /api/planner/tasks/:id`, `GET /api/planner/summary`
- Timer logs: `POST /api/timer/logs`, `GET /api/timer/logs`, `DELETE /api/timer/logs/:id`
- Projects: `POST /api/projects`, `GET /api/projects`, `PATCH /api/projects/:id`, `GET /api/projects/:id/summary`
- Dashboard: `GET /api/dashboard/summary?days=7&projectId=optional`
- Export: `GET /api/export` (JSON bundle of projects, planner, pomodoro, timers)
- Teams (now free): `POST /api/teams`, `GET /api/teams`, `POST /api/teams/:id/members`, `DELETE /api/teams/:id/members/:memberId`, `GET /api/teams/:id/summary`, `POST /api/teams/:id/messages`, `GET /api/teams/:id/messages`
- Real-time events (SSE): `GET /api/events/stream?teamId=&projectId=` — emits planner/pomodoro/timer/team message events for live collaboration
- Voice signaling (WebSocket): connect to `ws://<host>/api/voice`; join a room with `{"event":"join","data":{"room":"team-<id>"}}`, exchange `signal` messages for WebRTC; fetch ICE servers at `GET /api/voice/ice`
- Offline mode: set `OFFLINE_MODE=true` to avoid outbound calls; Zarinpal calls return mock success, voice ICE falls back to only env-provided TURN/STUN (no public STUN)

## Tests
- Unit: `npm test`
- E2E: `npm run test:e2e` (uses mongodb-memory-server automatically; no external Mongo needed)

## Build & run
- Build: `npm run build`
- Production start: `npm run start:prod`

## Docker
```
docker build -t time-backend .
docker run --env-file .env -p 3000:3000 time-backend
```

## Deployment notes
- Ensure HTTPS termination and `trust proxy` is preserved (already enabled for secure cookies).
- Set strong `SESSION_SECRET` and real OAuth/payment credentials before going live.
- Configure a Mongo database for both app data and session storage; use a separate collection if desired.
- Keep `FRONTEND_ORIGIN` in sync with your deployed frontend domains; multiple origins are supported via comma separation.
