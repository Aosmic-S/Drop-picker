# Deployment

## Environment variables

Copy `.env.example` to `.env` locally, and add the same values as repo secrets (**Settings → Secrets and variables → Actions**) for GitHub Actions to use them.

Required:
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `BRIGHTDATA_API_TOKEN`
- `COLLECTOR_NEWEGG`, `COLLECTOR_BESTBUY`, `COLLECTOR_WALMART`, `COLLECTOR_MICROCENTER`, `COLLECTOR_STEAM`, `COLLECTOR_GOG`

Optional:
- `DISCORD_WEBHOOK_URL` — without it, alerts are still saved to the database but not pushed to Discord
- `RETAIN_DAYS` — snapshot retention for `scripts/cleanup.ts` (default 90)

## Scheduled scraping

`.github/workflows/scrape.yml` runs `scrapers/run.ts` on a cron schedule using GitHub-hosted runners — no server or always-on machine required. Trigger it manually from the **Actions** tab (`workflow_dispatch`) for a live demo.

`.github/workflows/health-check.yml` runs `scrapers/health.ts` on its own schedule and fails the job (visible in the Actions tab) if any retailer hasn't produced fresh data recently.

## Dashboard

The dashboard reads directly from Supabase and deploys separately (e.g. Vercel, connected to its own repo or a subdirectory). It only needs the Supabase URL and anon/public key — never the service role key used by the scrapers.
