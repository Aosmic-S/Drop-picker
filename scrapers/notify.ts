import { supabase } from "./lib/supabase.js";
import { logger } from "./lib/logger.js";
import type { NewAlert } from "./types/alert.js";

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export async function notify(alert: NewAlert) {
  if (!WEBHOOK_URL) {
    logger.warn("DISCORD_WEBHOOK_URL not set — skipping notification");
    return;
  }

  const { data: product } = await supabase
    .from("products")
    .select("name, retailer, url")
    .eq("id", alert.productId)
    .single();

  const label = alert.type === "price_drop" ? "Price drop" : "Back in stock";
  const detail =
    alert.type === "price_drop" ? `$${alert.oldValue} → $${alert.newValue}` : "now available";

  const content = `**${label}**: ${product?.name ?? "Unknown product"} (${product?.retailer}) — ${detail}\n${product?.url ?? ""}`;

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    logger.error("Discord notification failed", { status: res.status });
  }
}
