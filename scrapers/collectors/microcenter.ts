import type { CollectorConfig } from "../types/scraper.js";

export const microcenter: CollectorConfig = {
  collectorId: process.env.COLLECTOR_MICROCENTER ?? "",
  retailer: "microcenter",
  category: "pc_parts",
  urls: [
    // e.g. "https://www.microcenter.com/product/XXXXXX/...",
  ],
};
