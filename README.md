# Job Tracker

Simple job application tracker with a `frontend/` app and `backend/` API.

## Project layout

- `frontend/` — web UI
- `backend/` — API, auth, database access
- `.env.example` — shared environment template
- `docker-compose.yml` — local Postgres + optional app containers

## Local development

### 1) Prereqs

Recommended:
- Node.js 20+
- npm, pnpm, or yarn
- Docker + Docker Compose

### 2) Configure environment

```bash
cp .env.example .env
```

Fill in the app secrets before running anything that needs auth or database access.

### 3) Start the database

```bash
docker compose up -d db
```

### 4) Run backend

```bash
cd backend
npm install
npm run dev
```

Expected default API URL: `http://localhost:4000`

### 5) Run frontend

```bash
cd frontend
npm install
npm run dev
```

Expected default app URL: `http://localhost:3000`

## Environment variables

Keep real secrets in `.env`, not in source control.

### Shared / backend

- `NODE_ENV` — `development` or `production`
- `PORT` — backend port
- `DATABASE_URL` — primary Postgres connection string
- `JWT_SECRET` — auth signing secret
- `CORS_ORIGIN` — frontend origin allowed by the API
- `LOG_LEVEL` — optional app logging level

### Frontend

- `VITE_API_URL` — public API base URL for the frontend

## Docker

### Local database only

```bash
docker compose up -d db
```

### Full stack

If both app folders include Dockerfiles:

```bash
docker compose up --build
```

## Deployment recommendations

This app is small enough to keep boring:

- **Frontend:** Vercel, Netlify, or Cloudflare Pages
- **Backend:** Fly.io, Railway, Render, or a small VPS with Docker
- **Database:** Neon, Supabase Postgres, Railway Postgres, or managed Postgres on your host

### Practical production shape

- Deploy frontend as static hosting
- Deploy backend as a single container/web service
- Use managed Postgres
- Set `CORS_ORIGIN` to the frontend production URL
- Rotate `JWT_SECRET` per environment
- Terminate TLS at the platform/load balancer

## Notes

- `docker-compose.yml` assumes the backend listens on `4000` and frontend on `3000`
- Adjust scripts/ports if the actual app uses different defaults
- If the frontend is static-only, you may not need the frontend service in Compose at all
