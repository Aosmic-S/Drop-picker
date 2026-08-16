import { supabase } from "./lib/supabase.js";
import { logger } from "./lib/logger.js";
import type { NewAlert } from "./types/alert.js";

/**
 * Compares the snapshot just inserted for `productId` against the one
 * before it. Returns an alert if the price dropped or the item restocked,
 * or null if nothing notable changed.
 */
export async function diffLatestSnapshot(productId: string): Promise<NewAlert | null> {
  const { data: snapshots, error } = await supabase
    .from("price_snapshots")
    .select("price_cents, in_stock, scraped_at")
    .eq("product_id", productId)
    .order("scraped_at", { ascending: false })
    .limit(2);

  if (error) throw error;
  if (!snapshots || snapshots.length < 2) return null; // first-ever scrape, nothing to compare

  const [latest, previous] = snapshots;

  if (latest.price_cents < previous.price_cents) {
    return {
      productId,
      type: "price_drop",
      oldValue: (previous.price_cents / 100).toFixed(2),
      newValue: (latest.price_cents / 100).toFixed(2),
    };
  }

  if (latest.in_stock && !previous.in_stock) {
    return {
      productId,
      type: "restock",
      oldValue: "out_of_stock",
      newValue: "in_stock",
    };
  }

  return null;
}

export async function saveAlert(alert: NewAlert) {
  const { error } = await supabase.from("alerts").insert({
    product_id: alert.productId,
    type: alert.type,
    old_value: alert.oldValue,
    new_value: alert.newValue,
  });
  if (error) throw error;
  logger.info("Alert saved", { type: alert.type, productId: alert.productId });
}
