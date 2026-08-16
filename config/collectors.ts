import type { CollectorConfig } from "../scrapers/types/scraper.js";
import { newegg } from "../scrapers/collectors/newegg.js";
import { bestbuy } from "../scrapers/collectors/bestbuy.js";
import { walmart } from "../scrapers/collectors/walmart.js";
import { microcenter } from "../scrapers/collectors/microcenter.js";
import { steam } from "../scrapers/collectors/steam.js";
import { gog } from "../scrapers/collectors/gog.js";

export const COLLECTORS: CollectorConfig[] = [newegg, bestbuy, walmart, microcenter, steam, gog];

export function isConfigured(config: CollectorConfig): boolean {
  return Boolean(config.collectorId) && config.urls.length > 0;
}
