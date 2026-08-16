import "dotenv/config";
import { runCollector } from "./lib/brightdata.js";
import { supabase } from "./lib/supabase.js";
import { logger } from "./lib/logger.js";
import { normalizeBatch } from "./lib/normalizer.js";
import { diffLatestSnapshot, saveAlert } from "./diff.js";
import { notify } from "./notify.js";
import { COLLECTORS, isConfigured } from "../config/collectors.js";
import type { CollectorConfig } from "./types/scraper.js";
import type { ScrapedRecord } from "./types/scraper.js";

async function processRecord(config: CollectorConfig, record: ScrapedRecord) {
  const { data: product, error: upsertError } = await supabase
    .from("products")
    .upsert(
      {
        url: record.url,
        name: record.name,
        retailer: config.retailer,
        category: config.category,
        image_url: record.imageUrl ?? null,
      },
      { onConflict: "url" }
    )
    .select("id")
    .single();

  if (upsertError || !product) {
    logger.error("Failed to upsert product", { url: record.url, error: upsertError?.message });
    return;
  }

  const { error: snapshotError } = await supabase.from("price_snapshots").insert({
    product_id: product.id,
    price_cents: record.priceCents,
    in_stock: record.inStock,
  });

  if (snapshotError) {
    logger.error("Failed to insert snapshot", { url: record.url, error: snapshotError.message });
    return;
  }

  const alert = await diffLatestSnapshot(product.id);
  if (alert) {
    await saveAlert(alert);
    await notify(alert);
    logger.info("Alert fired", { type: alert.type, productId: product.id });
  }
}

async function runOne(config: CollectorConfig) {
  if (!isConfigured(config)) {
    logger.warn("Skipping collector — not configured", { retailer: config.retailer });
    return;
  }

  logger.info("Running collector", { retailer: config.retailer, urlCount: config.urls.length });
  const raw = await runCollector(config.collectorId, config.urls);
  const records = normalizeBatch(raw, (r, err) =>
    logger.warn("Dropped unparseable record", { url: r.url, error: String(err) })
  );

  for (const record of records) {
    await processRecord(config, record);
  }
}

async function main() {
  for (const config of COLLECTORS) {
    try {
      await runOne(config);
    } catch (err) {
      logger.error("Collector run failed", {
        retailer: config.retailer,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  logger.info("Run complete");
}

main().catch((err) => {
  logger.error("Fatal error", { error: err instanceof Error ? err.message : String(err) });
  process.exit(1);
});
