# 🚀 Deployment Guide

How to deploy Aetheris Bot and its dashboard to production.

---

## 🤖 Bot — Railway

The bot (Discord client + Express API server) is hosted on [Railway](https://railway.app).

### Steps

1. Push your code to GitHub (Railway deploys from a connected repo).
2. In Railway, create a new project → **Deploy from GitHub repo** → select `aetheris-bot`.
3. Add the environment variables under **Variables** tab (same as your local `.env`):
   ```
   DISCORD_TOKEN
   SUPABASE_URL
   SUPABASE_KEY
   GUILD_ID
   API_SECRET
   ```
4. Railway auto-detects Node.js and runs `node index.js` based on `package.json`. If it doesn't, set the start command manually in **Settings → Deploy**.
5. Once deployed, Railway gives you a public URL (e.g. `https://aetheris-bot-production.up.railway.app`) — this is what the dashboard uses as its API base URL.

### Updating a deployment
Push to the connected branch (`main`) — Railway redeploys automatically.

### Checking logs
Railway dashboard → your service → **Deployments** tab → click the active deployment to view live logs.

---

## 🌐 Dashboard — Vercel

The dashboard is a static HTML/CSS/vanilla JS site hosted on [Vercel](https://vercel.com). It has **no build step and no environment variables** — credentials are set directly in source files before pushing.

### Steps

1. Before pushing, fill in the real values in two files:

   **`js/supabase.js`**
   ```javascript
   const SUPABASE_URL = 'your_supabase_url'
   const SUPABASE_KEY = 'your_supabase_publishable_key'
   ```

   **`js/dashboard.js`**
   ```javascript
   const API_URL = 'https://aetheris-bot-production.up.railway.app'
   const API_KEY = 'your_api_secret_key'   // must match the bot's API_SECRET
   ```

2. Push your dashboard code to its own GitHub repo.
3. In Vercel, **Add New Project** → import the dashboard repo. No environment variable configuration is needed since there's no build step — Vercel just serves the static files as-is.
4. Deploy. Vercel gives a public URL (e.g. `https://dashboardbot-nine.vercel.app`).

> ⚠️ **Security note**: because these files are committed to the repo, the Supabase publishable key and `API_KEY` are visible to anyone who can view the repo — and even more so if the repo is **public**. The Supabase key is designed to be public-facing, but `API_KEY` guards destructive admin endpoints (`/resetuser`, `/premium/generate`, `/premium/delete`, etc.) with no other auth layer. If the repo is public, rotate `API_SECRET` on the bot regularly and treat it as effectively public. For real production use, consider moving these admin actions behind a server-side proxy that validates the dashboard's Supabase Auth session instead of a static client-side key.

### Updating a deployment
Push to the connected branch — Vercel redeploys automatically and shows a preview URL for each PR.

---

## ✅ Post-deployment checklist

- [ ] Bot shows as online in Discord
- [ ] `GET /health` on the Railway URL returns `{ "status": "ok" }`
- [ ] Dashboard loads and can fetch `/members` successfully (API key working)
- [ ] Test one write action (e.g. `/event/start` from the dashboard) to confirm Supabase writes work
- [ ] Confirm Dependabot/`npm audit` shows no vulnerabilities post-deploy

---

*For environment variable details, see [`.env.example`](../.env.example). For API endpoints, see [API.md](API.md).*