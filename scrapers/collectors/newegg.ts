import type { CollectorConfig } from "../types/scraper.js";

export const newegg: CollectorConfig = {
  // Build this collector in Scraper Studio, describing fields:
  // "product name", "price", "in stock or not" — then paste its ID here.
  collectorId: process.env.COLLECTOR_NEWEGG ?? "",
  retailer: "newegg",
  category: "ram",
  urls: [
    // e.g. "https://www.newegg.com/p/N82E16820XXXXXX",
  ],
};
