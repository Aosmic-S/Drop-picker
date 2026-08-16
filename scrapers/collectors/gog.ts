import type { CollectorConfig } from "../types/scraper.js";

export const gog: CollectorConfig = {
  collectorId: process.env.COLLECTOR_GOG ?? "",
  retailer: "gog",
  category: "games",
  urls: [
    // e.g. "https://www.gog.com/en/game/XXXXXX",
  ],
};
