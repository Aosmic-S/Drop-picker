import type { RawScrapedRecord, ScrapedRecord } from "../types/scraper.js";

/** Turns "$1,299.99", "1299.99", or 1299.99 into 129999 (cents). */
function parsePriceToCents(price: string | number): number {
  if (typeof price === "number") return Math.round(price * 100);

  const cleaned = price.replace(/[^0-9.]/g, "");
  const value = parseFloat(cleaned);
  if (Number.isNaN(value)) {
    throw new Error(`Could not parse price: "${price}"`);
  }
  return Math.round(value * 100);
}

function parseInStock(value: boolean | string): boolean {
  if (typeof value === "boolean") return value;
  const normalized = value.trim().toLowerCase();
  return ["true", "in stock", "yes", "available"].some((s) => normalized.includes(s));
}

/** Cleans and validates a raw record from a collector into storage-ready shape. */
export function normalizeRecord(raw: RawScrapedRecord): ScrapedRecord {
  if (!raw.url || !raw.name) {
    throw new Error(`Incomplete record: ${JSON.stringify(raw)}`);
  }

  return {
    url: raw.url.trim(),
    name: raw.name.trim().replace(/\s+/g, " "),
    priceCents: parsePriceToCents(raw.price),
    inStock: parseInStock(raw.in_stock),
    imageUrl: raw.image_url?.trim(),
  };
}

/** Normalizes a batch, skipping (and logging) any records that fail to parse. */
export function normalizeBatch(
  raws: RawScrapedRecord[],
  onError?: (raw: RawScrapedRecord, error: unknown) => void
): ScrapedRecord[] {
  const results: ScrapedRecord[] = [];
  for (const raw of raws) {
    try {
      results.push(normalizeRecord(raw));
    } catch (err) {
      onError?.(raw, err);
    }
  }
  return results;
}
