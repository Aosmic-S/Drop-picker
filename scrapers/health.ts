import "dotenv/config";
import { supabase } from "./lib/supabase.js";
import { logger } from "./lib/logger.js";
import { COLLECTORS, isConfigured } from "../config/collectors.js";

const STALE_AFTER_HOURS = 6;

async function checkRetailer(retailer: string): Promise<{ retailer: string; healthy: boolean; lastSeen: string | null }> {
  const { data, error } = await supabase
    .from("price_snapshots")
    .select("scraped_at, products!inner(retailer)")
    .eq("products.retailer", retailer)
    .order("scraped_at", { ascending: false })
    .limit(1);

  if (error) {
    logger.error("Health check query failed", { retailer, error: error.message });
    return { retailer, healthy: false, lastSeen: null };
  }

  const lastSeen = data?.[0]?.scraped_at ?? null;
  if (!lastSeen) return { retailer, healthy: false, lastSeen: null };

  const hoursSince = (Date.now() - new Date(lastSeen).getTime()) / (1000 * 60 * 60);
  return { retailer, healthy: hoursSince <= STALE_AFTER_HOURS, lastSeen };
}

async function main() {
  const configured = COLLECTORS.filter(isConfigured);
  const results = await Promise.all(configured.map((c) => checkRetailer(c.retailer)));

  for (const r of results) {
    if (r.healthy) {
      logger.info(`Healthy: ${r.retailer}`, { lastSeen: r.lastSeen });
    } else {
      logger.warn(`Stale or broken: ${r.retailer}`, { lastSeen: r.lastSeen ?? "never" });
    }
  }

  const unhealthy = results.filter((r) => !r.healthy);
  if (unhealthy.length > 0) {
    logger.error(`${unhealthy.length} collector(s) need attention`, {
      retailers: unhealthy.map((r) => r.retailer),
    });
    process.exitCode = 1;
  }
}

main();
