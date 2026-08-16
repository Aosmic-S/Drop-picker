// Deletes price_snapshots older than RETAIN_DAYS, keeping the table small.
// Usage: npx tsx scripts/cleanup.ts
import "dotenv/config";
import { supabase } from "../scrapers/lib/supabase.js";
import { logger } from "../scrapers/lib/logger.js";

const RETAIN_DAYS = Number(process.env.RETAIN_DAYS ?? 90);

async function main() {
  const cutoff = new Date(Date.now() - RETAIN_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { error, count } = await supabase
    .from("price_snapshots")
    .delete({ count: "exact" })
    .lt("scraped_at", cutoff);

  if (error) {
    logger.error("Cleanup failed", { error: error.message });
    process.exit(1);
  }

  logger.info(`Cleanup complete — removed snapshots older than ${RETAIN_DAYS} days`, { removed: count ?? 0 });
}

main();
