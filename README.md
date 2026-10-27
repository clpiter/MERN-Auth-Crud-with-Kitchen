# Auth Crud with Kitchen

Kitchen Essentials: JWT login/signup, then a CRUD list of 100 daily kitchen needs (seeded automatically) with search, category filter, pagination, detail page, and add/edit/delete.

```
Backend/   Express + MongoDB API   -> deploy as Vercel project #1
frontend/  React + Vite + Redux Toolkit -> deploy as Vercel project #2
```

## Run locally

```bash
# Backend (needs MongoDB running locally, or set MONGODB_URI)
cd Backend
cp .env.example .env
npm install
npm run dev          # http://localhost:5000

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev          # http://localhost:5173
```

The admin account (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) and the 100 demo items are created on the first request if they don't exist. `npm run seed` in `Backend/` wipes all items and restores the demo list.

## API

All `/api/items` and `/auth/sessions` routes need `Authorization: Bearer <token>`.

### Sessions

Every login creates a session (one per device) stored in MongoDB:

- `token` is a short-lived access JWT (`ACCESS_TOKEN_TTL`, default 15 min) that carries the session id. On each request the server also checks that the session still exists, so logout/revoke takes effect immediately.
- `refreshToken` is a JWT for the session; only a bcrypt hash of its random id is stored. Each refresh rotates it (the old one stops working) and extends the session by `SESSION_TTL_DAYS` (default 7). Unused sessions expire and are removed by a MongoDB TTL index.
- The frontend refreshes the access token automatically, keeps all tabs in sync, and shows the user's devices under **Active sessions**.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/user/register` | Sign up |
| POST | `/auth/login` | Log in, returns `{ token, refreshToken }` |
| POST | `/auth/refresh-token` | Body `{ refreshToken }`, returns a new `{ token, refreshToken }` |
| POST | `/auth/logout` | Body `{ refreshToken }`, ends that session |
| GET | `/auth/sessions` | Active sessions of the user (`current: true` marks this device) |
| DELETE | `/auth/sessions/:id` | Log out one session |
| DELETE | `/auth/sessions` | Log out all other sessions |
| GET | `/api/items?search=&category=&page=&limit=` | Paginated list + categories |
| GET | `/api/items/:id` | Item detail |
| POST | `/api/items` | Create item |
| PUT | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |

## Deploy to Vercel

Vercel can't reach a MongoDB on your PC, so create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) first. Under **Network Access**, allow `0.0.0.0/0` (Vercel has no fixed IPs), then copy the connection string.

Push this repo to GitHub, then create **two** Vercel projects from it:

### 1. Backend

- **Root Directory:** `Backend`
- **Framework Preset:** Other
- **Environment Variables:**

  | Name | Value |
  | --- | --- |
  | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/kitchen` |
  | `JWT_SECRET` | a long random string (required: serverless instances must share it) |
  | `CORS_ORIGIN` | your frontend URL, e.g. `https://kitchen-frontend.vercel.app` (add after step 2) |
  | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | admin login (change the default password!) |

`Backend/vercel.json` rewrites every request to `api/index.js`, which exports the Express app. Open the deployed URL and you should see `{"status":"ok"}`.

### 2. Frontend

- **Root Directory:** `frontend`
- **Framework Preset:** Vite
- **Environment Variables:** `VITE_API_URL` = your backend URL, e.g. `https://kitchen-backend.vercel.app` (no trailing slash)

`frontend/vercel.json` rewrites all paths to `index.html` so routes like `/items/123` work on refresh.

Finally, set `CORS_ORIGIN` on the backend to the frontend URL and redeploy the backend.

> `VITE_API_URL` is baked in at build time. If you change it, redeploy the frontend.

### Using the Vercel CLI instead

```bash
npm i -g vercel
cd Backend  && vercel --prod   # then add env vars in the dashboard and redeploy
cd frontend && vercel --prod
```
