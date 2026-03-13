# Cloudflare Pages Deployment Guide

This portfolio deploys to **both** GitHub Pages and Cloudflare Pages from the same `gh-pages` branch. When you run `npm run deploy`, both sites update automatically.

---

## How It Works

```
npm run deploy
    ↓
builds dist/ and pushes to gh-pages branch
    ↓
┌─────────────────────────────┬──────────────────────────────────┐
│ GitHub Pages (automatic)    │ Cloudflare Pages (via workflow)  │
│ arunbhy.github.io           │ arunbhy-portfolio.pages.dev      │
└─────────────────────────────┴──────────────────────────────────┘
```

---

## One-Time Setup

### Step 1: Get Your Cloudflare Account ID

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. On the main dashboard, look at the URL — it contains your account ID:
   `https://dash.cloudflare.com/<ACCOUNT_ID>/...`
3. Alternatively: click any domain → **Overview** → scroll down on the right sidebar → **Account ID**
4. Copy this value — you'll need it in Step 3

### Step 2: Create a Cloudflare API Token

1. Go to [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use the **"Edit Cloudflare Workers"** template (click "Use template")
4. Under **Permissions**, ensure it includes:
   - Account → Cloudflare Pages → Edit
   - Account → Workers Scripts → Edit
5. Under **Account Resources**, select your account
6. Click **Continue to summary** → **Create Token**
7. Copy the token immediately — it won't be shown again

### Step 3: Add Secrets to GitHub

1. Go to your repo: [github.com/arunbhy/arunbhy.github.io/settings/secrets/actions](https://github.com/arunbhy/arunbhy.github.io/settings/secrets/actions)
2. Click **New repository secret** and add:

   | Name | Value |
   |------|-------|
   | `CLOUDFLARE_API_TOKEN` | The API token from Step 2 |
   | `CLOUDFLARE_ACCOUNT_ID` | The account ID from Step 1 |

### Step 4: Create the Cloudflare Pages Project

**Option A: Via Dashboard (recommended for first time)**

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create**
2. Select **Pages** → **Connect to Git**
3. Authorize GitHub if prompted, then select **arunbhy/arunbhy.github.io**
4. Configure the build:

   | Setting | Value |
   |---------|-------|
   | Production branch | `gh-pages` |
   | Build command | *(leave empty)* |
   | Build output directory | `/` |

5. Click **Save and Deploy**
6. Note: the project name must match what's in the workflow file. If Cloudflare names it something other than `arunbhy-portfolio`, update `.github/workflows/deploy-cloudflare.yml` to match

**Option B: Via CLI**

```bash
npm install -g wrangler
wrangler login
wrangler pages project create arunbhy-portfolio
```

### Step 5: Verify

1. Push any change and run:
   ```bash
   npm run deploy
   ```
2. Check both sites:
   - GitHub Pages: [arunbhy.github.io](https://arunbhy.github.io)
   - Cloudflare Pages: `arunbhy-portfolio.pages.dev`
3. Check the GitHub Actions tab to confirm the Cloudflare workflow ran successfully:
   [github.com/arunbhy/arunbhy.github.io/actions](https://github.com/arunbhy/arunbhy.github.io/actions)

---

## Custom Domain on Cloudflare (Optional)

If you want to point a custom domain to Cloudflare Pages:

1. Go to your Cloudflare Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `arunbhy.com`)
4. Cloudflare will auto-configure DNS if the domain is on your Cloudflare account
5. SSL is automatic

---

## Troubleshooting

### Workflow not triggering
- Ensure the workflow file (`.github/workflows/deploy-cloudflare.yml`) is present on the `main` branch (GitHub reads workflows from the default branch)
- Check Actions tab for errors

### "Project not found" error
- The project name in the workflow (`arunbhy-portfolio`) must match the Cloudflare Pages project name exactly
- Verify with: `wrangler pages project list`

### API token permission error
- Ensure the token has **Cloudflare Pages: Edit** permission
- Ensure the token is scoped to the correct account

### Build output looks wrong
- The `gh-pages` branch should contain the built files directly (not inside a `dist/` folder)
- `npm run deploy` via `gh-pages -d dist` handles this correctly

---

## Files Involved

| File | Purpose |
|------|---------|
| `.github/workflows/deploy-cloudflare.yml` | GitHub Action that deploys to Cloudflare on gh-pages push |
| `package.json` → `deploy` script | Builds and pushes to gh-pages (triggers both deployments) |
