# Drop Picker

Self-healing price & restock tracker for PC parts, RAM, games, and consoles — built on Bright Data Scraper Studio + Supabase.

Drop Picker watches prices and stock across six retailers and alerts you the moment something drops in price or comes back in stock. It uses Bright Data Scraper Studio collectors that keep working even when a retailer redesigns its site — no manual selector fixes, no broken scrapes.

Built for the **Into the Scrape-Verse** hackathon (WeMakeDevs × Bright Data).

## How it works

See [`docs/architecture.md`](docs/architecture.md) for the full breakdown. In short:

1. Each retailer has a Scraper Studio collector, described once in plain language.
2. `scrapers/run.ts` triggers every configured collector, normalizes the results, and writes a new `price_snapshots` row per product.
3. `scrapers/diff.ts` compares each new snapshot to the previous one and creates an `alerts` row on a price drop or restock.
4. `scrapers/notify.ts` posts the alert to Discord.
5. `scrapers/health.ts` separately flags any retailer that's gone quiet or stale.
6. The dashboard (separate app) reads live from Supabase with realtime subscriptions.

## Setup

```bash
npm install
cp .env.example .env   # fill in Supabase, Bright Data, and Discord values
npm run setup           # verifies everything required is configured
```

Apply the migrations in `supabase/migrations/` (in order) via the Supabase SQL editor or `supabase db push`.

Build a collector per retailer in Scraper Studio, then paste each Collector ID into `.env`. Add target product URLs into the matching file in `scrapers/collectors/`. Test one in isolation before running everything:

```bash
npm run test:collector -- newegg
```

Then run the full pipeline:

```bash
npm start
```

`.github/workflows/scrape.yml` runs this on a schedule via GitHub Actions — add the same env vars as repo secrets. `.github/workflows/health-check.yml` runs `scrapers/health.ts` on its own schedule to catch silent failures.

## Retailers & categories

| Retailer | Category |
|---|---|
| Newegg | RAM |
| Best Buy | Consoles |
| Walmart | Consoles |
| Micro Center | PC Parts |
| Steam | Games |
| GOG | Games |

## Testing

```bash
npm test
```

## Docs

- [Architecture](docs/architecture.md)
- [Collectors](docs/collectors.md)
- [Database](docs/database.md)
- [Deployment](docs/deployment.md)
- [Troubleshooting](docs/troubleshooting.md)

## Stack

- **Bright Data Scraper Studio** — self-healing collectors
- **Supabase** — Postgres + realtime
- **TypeScript** — scrapers, scripts, and dashboard
- **Vitest** — tests
- Discord webhooks for alerts

## License

MIT
