# 🏪 Playwright-store "Vault"

> A purpose-built Playwright testing playground disguised as an e-commerce store. Every component exists to showcase a real-world testing challenge — from shadow DOM to iframe interactions, nested scroll containers to full auth flows.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [1. Clone & Install](#1-clone--install)
- [2. PocketBase Setup](#2-pocketbase-setup)
- [3. Environment Variables](#3-environment-variables)
- [4. Seed the Database](#4-seed-the-database)
- [5. Run the App Locally](#5-run-the-app-locally)
- [6. Deploy to GoDaddy (via Netlify)](#6-deploy-to-godaddy-via-netlify)
- [⚠️ Critical Gotchas](#️-critical-gotchas)
- [Troubleshooting](#troubleshooting)

---

## Overview

This project is a Vite-powered frontend store that uses **PocketBase** as its backend/database. It's deployed via **Netlify** and can be pointed at a custom domain through **GoDaddy DNS**.

**Stack:**
- Frontend: Vite + Vanilla JS
- Backend/Auth/DB: PocketBase (self-hosted or cloud)
- Hosting: Netlify
- Domain: GoDaddy

---

## Prerequisites

Make sure you have the following installed before starting:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- [PocketBase](https://pocketbase.io/docs/) binary (download for your OS)
- A [Netlify](https://netlify.com) account (free tier works)
- A [GoDaddy](https://godaddy.com) account with a domain

---

## 1. Clone & Install

```bash
git clone https://github.com/scjm/Playwright-store.git
cd Playwright-store
npm install
```

---

## 2. PocketBase Setup

### Download PocketBase

Go to [https://pocketbase.io/docs/](https://pocketbase.io/docs/) and download the binary for your operating system.

Place the `pocketbase` executable in a folder, e.g.:

```
/your-projects/pocketbase/
```

### Start PocketBase

```bash
# Navigate to where you placed the binary
cd /your-projects/pocketbase

# Start the server
./pocketbase serve
```

PocketBase will start on `http://127.0.0.1:8090` by default.

### Create Your Admin Account

1. Open your browser and go to: `http://127.0.0.1:8090/_/`
2. You'll be prompted to create an **admin email and password** — do this now
3. Log in with those credentials

### ⚠️ IMPORTANT: Disable Email Verification

> This is the step that will break everything if you skip it. By default PocketBase requires users to verify their email before they can authenticate. This causes auth to silently fail during testing.

**To disable it:**

1. In the PocketBase Admin UI (`http://127.0.0.1:8090/_/`)
2. Go to **Collections** → click on the **`users`** collection
3. Click the **⚙️ gear / settings icon** on the collection
4. Find **"Require email verification"** — **turn this OFF**
5. Click **Save**

Without this step, login will return a token but the user will be considered unauthenticated, causing confusing test failures.

### Get Your PocketBase Admin Token

You need this token to run the seed script and for any admin-level API calls.

**Method 1 — Via the API (recommended):**

```bash
curl -X POST http://127.0.0.1:8090/api/admins/auth-with-password \
  -H "Content-Type: application/json" \
  -d '{"identity": "your-admin@email.com", "password": "your-admin-password"}'
```

The response will include a `token` field:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": { ... }
}
```

Copy that `token` value — you'll need it for your `.env` file.

**Method 2 — Via the Admin UI:**

1. Go to `http://127.0.0.1:8090/_/`
2. Open the browser DevTools → Network tab
3. Log in with your admin credentials
4. Look for the request to `/api/admins/auth-with-password`
5. Copy the `token` from the response

---

## 3. Environment Variables

Copy the example env file:

```bash
cp .env.example .env
```

Then open `.env` and fill in your values:

```env
# Your running PocketBase instance URL
VITE_PB_URL=http://127.0.0.1:8090

# PocketBase Admin token (see "Get Your PocketBase Admin Token" above)
VITE_PB_ADMIN_TOKEN=your_admin_token_here
```

> **Never commit your `.env` file.** It's already in `.gitignore` — keep it that way.

---

## 4. Seed the Database

Once PocketBase is running and your `.env` is configured, seed the store with products and user data:

```bash
node pb-seed.js
```

This will create the required collections and populate them with test data. Check the PocketBase Admin UI afterwards to confirm collections were created under the **Collections** tab.

---

## 5. Run the App Locally

```bash
npm run dev
```

The store will be available at `http://localhost:5173` (or whichever port Vite picks).

Open it in your browser and you should see the Vault store fully loaded with products.

---

## 6. Deploy to GoDaddy (via Netlify)

The project includes a `netlify.toml` config file so deployment is straightforward.

### Step 1 — Deploy to Netlify

1. Push your repo to GitHub (already done ✅)
2. Go to [https://app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Connect your GitHub account and select `Playwright-store`
4. Netlify will auto-detect the build settings from `netlify.toml`
5. Click **Deploy site**

### Step 2 — Add Environment Variables in Netlify

1. In your Netlify site dashboard go to **Site configuration** → **Environment variables**
2. Add:
   - `VITE_PB_URL` → your PocketBase URL (if hosted publicly, e.g. `https://your-pb.fly.dev`)
   - `VITE_PB_ADMIN_TOKEN` → your admin token

> **Note:** For production, PocketBase needs to be hosted somewhere publicly accessible (not `localhost`). Options include [Fly.io](https://fly.io), [Railway](https://railway.app), or [PocketHost](https://pockethost.io).

### Step 3 — Connect Your GoDaddy Domain

1. In Netlify, go to **Domain management** → **Add a domain** → enter your GoDaddy domain
2. Netlify will give you DNS records to add — typically a **CNAME** record

**In GoDaddy:**

1. Log in to GoDaddy → **My Products** → find your domain → click **DNS**
2. Add or edit the following record:
   - **Type:** `CNAME`
   - **Name:** `www` (or `@` for root domain)
   - **Value:** your Netlify subdomain, e.g. `your-site-name.netlify.app`
   - **TTL:** 1 hour (or default)
3. Save and wait for DNS propagation (can take up to 48 hours, usually much faster)

4. Back in Netlify, click **Verify DNS configuration** — once it goes green, Netlify will auto-provision an SSL certificate via Let's Encrypt

---

## ⚠️ Critical Gotchas

| Issue | What Happens | Fix |
|-------|-------------|-----|
| Email verification enabled | Auth returns token but user is treated as unauthenticated, tests fail mysteriously | Turn off "Require email verification" in PocketBase users collection settings |
| Wrong PocketBase URL in `.env` | App loads but can't fetch products or authenticate | Make sure `VITE_PB_URL` matches where PocketBase is actually running |
| Using localhost PocketBase in production | Works locally, breaks on Netlify | Host PocketBase publicly and update `VITE_PB_URL` in Netlify env vars |
| Seed script fails | Collections not created, store is empty | Ensure PocketBase is running and your admin token in `.env` is valid and not expired |
| GoDaddy DNS not propagating | Site shows old content or Netlify can't verify | Wait up to 48hrs; check with `nslookup yourdomain.com` |

---

## Troubleshooting

**PocketBase won't start**
```bash
# Make sure the binary is executable
chmod +x ./pocketbase
./pocketbase serve
```

**Seed script fails with auth error**
- Your admin token may have expired — re-generate it using the curl command above
- Double-check there are no extra spaces in your `.env` file

**Products not loading in the store**
- Open browser DevTools → Console — look for failed fetch requests
- Confirm `VITE_PB_URL` is correct and PocketBase is running
- Check that the seed script completed successfully (collections exist in PocketBase Admin UI)

**Netlify build fails**
- Check the build log in Netlify for specific errors
- Ensure all required env vars are set in Netlify's environment variables section

**GoDaddy domain not connecting**
- Verify the CNAME record is saved correctly in GoDaddy DNS
- Use [https://dnschecker.org](https://dnschecker.org) to check propagation status

---

## 📁 Project Structure

```
Playwright-store/
├── src/               # App source files
├── index.html         # Entry point
├── vite.config.js     # Vite config
├── netlify.toml       # Netlify deployment config
├── pb-seed.js         # PocketBase database seeder
├── package.json       # Dependencies and scripts
├── .env.example       # Environment variable template
└── .gitignore
```

---

## 🧪 Using This for Playwright Testing

Once the store is running, you have a fully functional e-commerce app with:

- Product listings with real data
- Auth flows (login/register)
- Shadow DOM components
- iframe interactions
- Nested scroll containers
- Form validation

These are all intentionally designed Playwright testing challenges — happy testing! 🎭
