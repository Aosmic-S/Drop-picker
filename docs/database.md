# Database

Supabase Postgres. Schema lives in `supabase/migrations/`, applied in order.

## Tables

**products** — one row per tracked product, keyed by unique `url`. Re-scraping the same URL updates the same row via upsert.

**price_snapshots** — one row per product per scrape run. Never updated in place, only inserted — this is the history table that price charts and diffing both read from.

**alerts** — one row per detected price drop or restock, created by `scrapers/diff.ts`. `notified` tracks whether the Discord webhook fired successfully (currently set at insert time; wire it to the notify result if you want stricter delivery tracking).

## Migrations

- `0001_init.sql` — core tables
- `0002_indexes.sql` — indexes for the "latest snapshot per product" and "recent alerts" query patterns
- `0003_realtime.sql` — adds `price_snapshots` and `alerts` to the `supabase_realtime` publication so the dashboard can subscribe to live changes

Apply via the Supabase SQL editor (paste each file in order) or `supabase db push` if using the CLI.

## Seed data

`supabase/seed.sql` inserts a few sample products and snapshots — useful for building the dashboard UI before any real collector has run. Not applied automatically; run it manually when you want demo data.
