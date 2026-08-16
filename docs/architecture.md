# Architecture

## Flow

1. **Collectors** (`scrapers/collectors/`) — one config per retailer, each pointing at a Bright Data Scraper Studio collector ID and a list of product URLs to watch.
2. **Runner** (`scrapers/run.ts`) — iterates over every configured collector (`config/collectors.ts`), triggers it via `scrapers/lib/brightdata.ts`, normalizes results (`scrapers/lib/normalizer.ts`), and upserts products + inserts a new row into `price_snapshots` per product.
3. **Diff** (`scrapers/diff.ts`) — after each snapshot is written, compares it to the previous snapshot for that product. A lower price or a stock flip from false→true creates a row in `alerts`.
4. **Notify** (`scrapers/notify.ts`) — posts new alerts to a Discord webhook.
5. **Health** (`scrapers/health.ts`) — separately, checks whether each retailer has produced a snapshot within the last few hours and flags anything stale or silently broken.
6. **Dashboard** (separate repo/app) — reads `products`, `price_snapshots`, and `alerts` from Supabase directly, with realtime subscriptions for live updates.

## Why self-healing matters here

Retail sites redesign product pages often. Scraper Studio collectors are described by field intent ("price", "in stock"), not brittle CSS selectors — when a site's layout changes, Scraper Studio re-derives extraction from that description instead of returning empty data. The pipeline above doesn't need to know this happened; it just keeps getting clean records.

## Scheduling

`.github/workflows/scrape.yml` runs `scrapers/run.ts` on a cron schedule via GitHub Actions. `.github/workflows/health-check.yml` runs `scrapers/health.ts` separately to catch collectors that have gone quiet.
