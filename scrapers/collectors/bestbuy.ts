import type { CollectorConfig } from "../types/scraper.js";

export const bestbuy: CollectorConfig = {
  collectorId: process.env.COLLECTOR_BESTBUY ?? "",
  retailer: "bestbuy",
  category: "consoles",
  urls: [
    // e.g. "https://www.bestbuy.com/site/XXXXXX.p",
  ],
};
