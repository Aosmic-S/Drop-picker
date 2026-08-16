# Collectors

Each retailer has one Scraper Studio collector and one config file in `scrapers/collectors/`.

| File | Retailer | Category |
|---|---|---|
| `newegg.ts` | Newegg | ram |
| `bestbuy.ts` | Best Buy | consoles |
| `walmart.ts` | Walmart | consoles |
| `microcenter.ts` | Micro Center | pc_parts |
| `steam.ts` | Steam | games |
| `gog.ts` | GOG | games |

## Adding a new collector

1. In Scraper Studio, create a collector against a sample product page. Describe each field in plain language — `name`, `price`, `in_stock` — matching the field names expected in `scrapers/types/scraper.ts` (`RawScrapedRecord`).
2. Copy the collector ID (starts with `c_`) into `.env` as `COLLECTOR_<RETAILER>`.
3. Add a new file in `scrapers/collectors/` following the existing pattern.
4. Register it in `config/collectors.ts`.
5. Test it in isolation before wiring it into the scheduled run:
   ```
   npx tsx scripts/test-collector.ts <retailer>
   ```
   This prints normalized results to the console without writing to Supabase.

## Field expectations

- `price` — either a number or a string like `"$1,299.99"`; `normalizer.ts` handles both.
- `in_stock` — either a boolean or a string like `"In Stock"` / `"Sold Out"`.
- `url` and `name` are required; records missing either are dropped and logged, not written.
