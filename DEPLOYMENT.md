
# 🏎️ F1-Dash Free Tier Deployment Guide

Deploy f1-dash for a race weekend using **100% free tier services** — no credit card required.

## Architecture Overview

```
┌──────────────────┐         ┌──────────────────────┐
│   Vercel (Free)  │         │  Render.com (Free)   │
│   Next.js 16     │◄───────►│  api service         │
│   Dashboard      │         │  /api/schedule       │
│                  │         │  /api/schedule/next   │
│   *.vercel.app   │         │  *.onrender.com      │
└────────┬─────────┘         └──────────────────────┘
         │
         │ SSE (browser → realtime)
         ▼
┌──────────────────────┐         ┌──────────────────────┐
│  Render.com (Free)   │────────►│  F1 Live Timing      │
│  realtime service    │ SignalR │  (formula1.com)      │
│  /api/realtime (SSE) │◄────────│                      │
│  *.onrender.com      │         └──────────────────────┘
└──────────────────────┘
```

| Component   | Platform    | Tier         | Cost | Credit Card |
| ----------- | ----------- | ------------ | ---- | ----------- |
| Dashboard   | Vercel      | Hobby (Free) | $0   | No          |
| API         | Render.com  | Free         | $0   | No          |
| Realtime    | Render.com  | Free         | $0   | No          |

---

## Free Tier Limits & Viability

### Vercel Hobby Plan
| Resource             | Limit               |
| -------------------- | -------------------- |
| Bandwidth            | 100 GB/month         |
| Build Minutes        | 6,000 min/month      |
| Function Invocations | 1,000,000/month      |
| Deployments          | Unlimited            |

> [!NOTE]
> The Hobby plan is for **personal, non-commercial** use only. More than enough for a race weekend dashboard.

### Render.com Free Plan
| Resource         | Limit                                  |
| ---------------- | -------------------------------------- |
| Instance Hours   | 750 hours/month (shared across services) |
| RAM              | 512 MB per service                     |
| CPU              | 0.1 vCPU per service                   |
| Services         | Up to 25                               |
| Sleep on Idle    | After 15 minutes of no traffic         |
| Cold Start       | ~30-60 seconds                         |

> [!IMPORTANT]
> **750 hours ÷ 2 services = 375 hours each ≈ 15.6 days** of continuous runtime. Since free services sleep during inactivity (saving hours), this is **more than enough** for a race weekend. During active F1 sessions, SSE connections from viewers keep the realtime service alive.

---

## Prerequisites

- A [GitHub](https://github.com) account (your repo: `slowlydev/f1-dash`)
- A [Vercel](https://vercel.com) account (sign up with GitHub)
- A [Render](https://render.com) account (sign up with GitHub)

---

## Step 1: Deploy the Rust Backend Services on Render

Both Rust services (`api` and `realtime`) use the same multi-stage Dockerfile at the project root. Render will pull Docker images directly from your GitHub Container Registry (GHCR), or you can build from source.

### Option A: Deploy from Pre-built Docker Images (Recommended)

If your CI/CD has already pushed images to GHCR (via the `release.yaml` workflow), you can deploy those directly.

#### 1.1 Deploy the API Service

1. Go to [Render Dashboard](https://dashboard.render.com) → **+ New** → **Web Service**
2. Select **"Deploy an existing image from a registry"**
3. Enter the image URL:
   ```
   ghcr.io/slowlydev/f1-dash-api:latest
   ```
   > If the image is private, add your GitHub credentials:
   > - Username: your GitHub username
   > - Password: a GitHub Personal Access Token with `read:packages` scope
4. Configure the service:
   - **Name**: `f1-dash-api`
   - **Region**: Choose the closest to your users (e.g., `Frankfurt (EU Central)`)
   - **Instance Type**: **Free**
5. Add **Environment Variables**:

   | Key        | Value                                          |
   | ---------- | ---------------------------------------------- |
   | `ADDRESS`  | `0.0.0.0:10000`                                |
   | `RUST_LOG` | `api=info`                                     |
   | `ORIGIN`   | `https://your-app-name.vercel.app`             |

   > [!WARNING]
   > The `ORIGIN` value must match your Vercel deployment URL exactly **without a trailing slash** (e.g. `https://f1-dash.vercel.app`, NOT `https://f1-dash.vercel.app/`). You can update this after deploying the dashboard in Step 2. Separate multiple origins with `;` if needed (e.g., `https://f1-dash.vercel.app;http://localhost:3000`).

6. Click **Deploy Web Service**
7. Note down the service URL (e.g., `https://f1-dash-api.onrender.com`)

#### 1.2 Deploy the Realtime Service

1. Go to Render Dashboard → **+ New** → **Web Service**
2. Select **"Deploy an existing image from a registry"**
3. Enter the image URL:
   ```
   ghcr.io/slowlydev/f1-dash-realtime:latest
   ```
4. Configure the service:
   - **Name**: `f1-dash-realtime`
   - **Region**: Same as the API service
   - **Instance Type**: **Free**
5. Add **Environment Variables**:

   | Key        | Value                                          |
   | ---------- | ---------------------------------------------- |
   | `ADDRESS`  | `0.0.0.0:10000`                                |
   | `RUST_LOG` | `realtime=info`                                |
   | `ORIGIN`   | `https://your-app-name.vercel.app`             |

   > [!IMPORTANT]
   > Do **NOT** set `F1_DEV_URL`. This variable is only for local development with the simulator. In production, the realtime service automatically connects to `livetiming.formula1.com/signalr`.

6. Click **Deploy Web Service**
7. Note down the service URL (e.g., `https://f1-dash-realtime.onrender.com`)

### Option B: Deploy from GitHub Repo (Build on Render)

If you don't have pre-built images, Render can build from your Dockerfile.

1. Go to Render Dashboard → **+ New** → **Web Service**
2. Connect your GitHub repository `slowlydev/f1-dash`
3. Configure:
   - **Name**: `f1-dash-api` (or `f1-dash-realtime`)
   - **Root Directory**: `.` (project root)
   - **Runtime**: **Docker**
   - **Dockerfile Path**: `./dockerfile`
   - **Docker Command**: `/api` (for the API service) or `/realtime` (for the realtime service)
   - **Instance Type**: **Free**
4. Set the same environment variables as Option A above
5. Deploy

> [!IMPORTANT]
> The free tier on Render does not support the `Docker Build Target` setting. We build a single image containing both binaries, and use the **Docker Command** setting to specify which binary to run (`/api` or `/realtime`).

> [!NOTE]
> Building Rust from source on Render's free tier may be slow (~10-15 min) and could run into memory limits. Pre-built Docker images (Option A) are strongly recommended.

---

## Step 2: Deploy the Dashboard on Vercel

### 2.1 Import the Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → **Add New...** → **Project**
2. Select **Import Git Repository** → find `slowlydev/f1-dash`
3. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `dashboard`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm ci` (auto-detected)

### 2.2 Set Environment Variables

Add the following environment variables in the Vercel project settings:

| Key                     | Value                                           | Scope            |
| ----------------------- | ----------------------------------------------- | ---------------- |
| `NEXT_PUBLIC_LIVE_URL`  | `https://f1-dash-realtime.onrender.com`         | All environments |
| `API_URL`               | `https://f1-dash-api.onrender.com`              | All environments |
| `SKIP_ENV_VALIDATION`   | `1`                                             | All environments |

> [!IMPORTANT]
> - `NEXT_PUBLIC_LIVE_URL` is used **client-side** (browser → realtime SSE). It must use `https://`.
> - `API_URL` is used **server-side** (Next.js SSR → API). It must use `https://`.
> - `SKIP_ENV_VALIDATION=1` is needed during the build step because `NEXT_PUBLIC_LIVE_URL` requires `http` in its Zod validation — but at build time, the actual runtime value isn't used. You can remove this once the build succeeds.
> - Replace the example URLs with the actual Render service URLs from Step 1.

### 2.3 Deploy

Click **Deploy**. Vercel will:
1. Clone the repo
2. Install dependencies with Yarn
3. Build the Next.js app
4. Deploy to the edge

Note your deployment URL (e.g., `https://your-project.vercel.app`).

### 2.4 Update CORS Origins on Render

Now that you know your Vercel URL, go back to Render and update the `ORIGIN` environment variable on **both** services:

```
ORIGIN=https://your-project.vercel.app
```

Render will automatically redeploy when you save the environment variable change.

---

## Step 3: Verify the Deployment

### Health Checks

Test that both backend services are running:

```bash
# API health check
curl https://f1-dash-api.onrender.com/api/health

# Realtime health check
curl https://f1-dash-realtime.onrender.com/api/health

# API schedule endpoint
curl https://f1-dash-api.onrender.com/api/schedule/next
```

> [!NOTE]
> The first request after a period of inactivity will take ~30-60 seconds (cold start). Subsequent requests will be fast.

### Dashboard

Open your Vercel URL in a browser. You should see:
- The race schedule loading from the API
- During a live F1 session: real-time timing data streaming via SSE

---

## Step 4: Race Weekend Preparation

### Wake Up Services Before the Session

Free Render services sleep after 15 minutes of inactivity. **Before a session starts**, wake them up:

```bash
# Wake up both services ~5 minutes before the session
curl https://f1-dash-api.onrender.com/api/health
curl https://f1-dash-realtime.onrender.com/api/health
```

### Keeping Services Alive During a Session

- **Realtime service**: As long as at least one user has the dashboard open, the SSE connection keeps the service alive. The background F1 ingestion task runs continuously.
- **API service**: Each page load fetches the schedule, keeping it alive during active use.

### Optional: Use a Free Uptime Monitor

To prevent services from sleeping during race weekends, set up a free monitoring service:

1. Go to [UptimeRobot](https://uptimerobot.com) (free tier: 50 monitors, 5-min intervals)
2. Create two HTTP monitors:
   - `https://f1-dash-api.onrender.com/api/health` — every 5 minutes
   - `https://f1-dash-realtime.onrender.com/api/health` — every 5 minutes
3. **Enable the monitors only during race weekends** to conserve Render instance hours

> [!TIP]
> You can also use [cron-job.org](https://cron-job.org) (free) to ping the services on a schedule. Set up cron jobs only for race weekend hours to save instance hours.

---

## Environment Variables Reference

### Dashboard (Vercel)

| Variable               | Required | Description                                             | Example                                         |
| ---------------------- | -------- | ------------------------------------------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_LIVE_URL` | ✅       | Realtime SSE URL (used client-side in browser)          | `https://f1-dash-realtime.onrender.com`         |
| `API_URL`              | ✅       | API URL (used server-side for schedule fetch)            | `https://f1-dash-api.onrender.com`              |
| `SKIP_ENV_VALIDATION`  | ⚠️       | Set to `1` during build if env validation blocks build  | `1`                                             |
| `TRACKING_ID`          | ❌       | Rybbit analytics tracking ID                            |                                                 |
| `TRACKING_URL`         | ❌       | Rybbit analytics script URL                             |                                                 |
| `DISABLE_IFRAME`       | ❌       | Disable iframe embedding                                | `1`                                             |

### API Service (Render)

| Variable   | Required | Description                        | Example                                |
| ---------- | -------- | ---------------------------------- | -------------------------------------- |
| `ADDRESS`  | ✅       | Bind address (host:port)           | `0.0.0.0:10000`                        |
| `RUST_LOG` | ⚠️       | Log verbosity                      | `api=info`                             |
| `ORIGIN`   | ✅       | CORS allowed origin (Vercel URL)   | `https://your-project.vercel.app`      |

### Realtime Service (Render)

| Variable     | Required | Description                                    | Example                                |
| ------------ | -------- | ---------------------------------------------- | -------------------------------------- |
| `ADDRESS`    | ✅       | Bind address (host:port)                       | `0.0.0.0:10000`                        |
| `RUST_LOG`   | ⚠️       | Log verbosity                                  | `realtime=info`                        |
| `ORIGIN`     | ✅       | CORS allowed origin (Vercel URL)               | `https://your-project.vercel.app`      |
| `F1_DEV_URL` | ❌       | **Do NOT set in production** — simulator only  |                                        |

---

## Troubleshooting

### CORS Errors in Browser Console

If you see `Access-Control-Allow-Origin` errors:
1. Verify the `ORIGIN` env var on both Render services matches your Vercel URL **exactly** (including `https://`, no trailing slash)
2. You can set multiple origins separated by `;`:
   ```
   ORIGIN=https://your-project.vercel.app;https://custom-domain.com
   ```
3. Redeploy the Render services after changing environment variables

### SSE Connection Fails / "Not Connected"

1. Check that `NEXT_PUBLIC_LIVE_URL` on Vercel points to the **realtime** service URL (not the API)
2. Ensure the realtime service is awake (hit its health endpoint first)
3. Verify the Render service logs for errors (Render Dashboard → Service → Logs)
4. If there's no active F1 session, the realtime service will still run but won't have data to stream

### Schedule Not Loading

1. Check that `API_URL` on Vercel points to the **api** service URL
2. The API fetches schedule data from an external iCal feed — verify the API service can reach the internet (check logs)
3. Schedule data is cached for 30 minutes (`time = 1800` in the `io_cached` attribute)

### Render Build Fails (Option B)

If building Rust from source on Render fails due to memory:
- Use pre-built Docker images (Option A) instead
- Or push to GHCR first via the GitHub Actions workflow:
  ```bash
  git tag v4.0.3
  git push origin v4.0.3
  ```
  This triggers the `release.yaml` workflow which builds and pushes all 3 images to GHCR.

### Cold Start Too Slow

- Render free tier cold starts take 30-60 seconds
- The Alpine-based Rust binaries are very lightweight (~10-20 MB), so boot time is mostly Render infrastructure overhead
- Set up UptimeRobot or cron-job.org pings during race sessions to keep services warm

---

## Cost Summary

| Service     | Monthly Cost | Notes                                          |
| ----------- | ------------ | ---------------------------------------------- |
| Vercel      | $0           | Hobby plan, personal use only                  |
| Render API  | $0           | Free tier, sleeps after 15 min inactivity       |
| Render RT   | $0           | Free tier, stays awake during active sessions   |
| UptimeRobot | $0           | Optional, free tier (50 monitors)               |
| **Total**   | **$0**       |                                                |
