# Troubleshooting

**`Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY`**
`.env` wasn't copied from `.env.example`, or a required value is blank. Run `npm run setup` to check.

**A collector run returns 0 records**
- Confirm the collector ID in `.env` matches the one shown in Scraper Studio.
- Confirm `urls` in the matching `scrapers/collectors/*.ts` file isn't empty.
- Run `npx tsx scripts/test-collector.ts <retailer>` in isolation to see raw output before it's normalized.

**Records are being silently dropped**
`normalizer.ts` skips and logs any record missing `url` or `name`, or with an unparseable price. Check the logged warning for the exact field that failed.

**No alerts are firing even though a price changed**
The first scrape for a product has nothing to compare against — `diffLatestSnapshot` needs at least two snapshots. Run the collector twice.

**Discord messages aren't arriving**
Confirm `DISCORD_WEBHOOK_URL` is set and the webhook hasn't been deleted from the Discord server's integration settings.

**GitHub Action fails but works locally**
Almost always a missing repo secret — Actions doesn't read your local `.env`. Re-check **Settings → Secrets and variables → Actions** against `.env.example`.

**`health.ts` reports a retailer as stale**
Either the collector hasn't been triggered recently (check the `scrape.yml` schedule), or it's failing silently — check the Actions run logs for that retailer's error.
