import type { Category, Retailer } from "./product.js";

export interface CollectorConfig {
  /** Bright Data Scraper Studio collector ID, e.g. "c_mp7x8a9b2c0d1e2f" */
  collectorId: string;
  retailer: Retailer;
  category: Category;
  /** Product page URLs this collector should visit */
  urls: string[];
}

/**
 * Raw shape returned by a Scraper Studio collector, before normalization.
 * Field names must match whatever was described in plain language when
 * the collector was built — prices may arrive as strings like "$549.99".
 */
export interface RawScrapedRecord {
  url: string;
  name: string;
  price: string | number;
  in_stock: boolean | string;
  image_url?: string;
}

/** Cleaned record, ready to write to Supabase. */
export interface ScrapedRecord {
  url: string;
  name: string;
  priceCents: number;
  inStock: boolean;
  imageUrl?: string;
}

export interface CollectorRunResult {
  retailer: Retailer;
  attempted: number;
  succeeded: number;
  failed: number;
  durationMs: number;
  error?: string;
}
