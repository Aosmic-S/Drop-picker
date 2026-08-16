import type { CollectorConfig } from "../types/scraper.js";

export const walmart: CollectorConfig = {
  collectorId: process.env.COLLECTOR_WALMART ?? "",
  retailer: "walmart",
  category: "consoles",
  urls: [
    // e.g. "https://www.walmart.com/ip/XXXXXXXXX",
  ],
};
