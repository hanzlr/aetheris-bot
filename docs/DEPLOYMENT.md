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

The dashboard is hosted on [Vercel](https://vercel.com).

### Steps

1. Push your dashboard code to its own GitHub repo.
2. In Vercel, **Add New Project** → import the dashboard repo.
3. Add environment variables under **Settings → Environment Variables**, including:
   ```
   NEXT_PUBLIC_API_URL       # the Railway bot API URL
   NEXT_PUBLIC_API_SECRET    # same as bot's API_SECRET
   SUPABASE_URL
   SUPABASE_KEY
   ```
   > ⚠️ Adjust variable names to match what your dashboard code actually expects.
4. Deploy. Vercel auto-builds and gives a public URL (e.g. `https://dashboardbot-nine.vercel.app`).

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