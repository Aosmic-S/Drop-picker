import type { CollectorConfig } from "../types/scraper.js";

export const steam: CollectorConfig = {
  collectorId: process.env.COLLECTOR_STEAM ?? "",
  retailer: "steam",
  category: "games",
  urls: [
    // e.g. "https://store.steampowered.com/app/XXXXXX/",
  ],
};
