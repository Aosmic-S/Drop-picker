// Wrapper around the Bright Data Scraper Studio Data Collection API.
// Docs: https://docs.brightdata.com/datasets/scraper-studio/quickstart
//
// Flow: POST /dca/trigger?collector=<id>  -> { collection_id }  (== snapshot_id)
//       GET  /dca/dataset?id=<snapshot_id> -> results once status is "ready"

import { logger } from "./logger.js";
import { withRetry } from "./retry.js";
import type { RawScrapedRecord } from "../types/scraper.js";

const BASE_URL = "https://api.brightdata.com";
const TOKEN = process.env.BRIGHTDATA_API_TOKEN;

if (!TOKEN) {
  throw new Error("Missing BRIGHTDATA_API_TOKEN in .env");
}

async function triggerCollector(collectorId: string, urls: string[]): Promise<string> {
  const res = await fetch(`${BASE_URL}/dca/trigger?collector=${collectorId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(urls.map((url) => ({ url }))),
  });

  if (!res.ok) {
    throw new Error(`Trigger failed for ${collectorId}: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.collection_id;
}

async function pollDataset(
  snapshotId: string,
  { intervalMs = 5000, timeoutMs = 120000 } = {}
): Promise<RawScrapedRecord[]> {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const res = await fetch(`${BASE_URL}/dca/dataset?id=${snapshotId}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    if (res.status === 202) {
      await new Promise((r) => setTimeout(r, intervalMs));
      continue;
    }

    if (!res.ok) {
      throw new Error(`Dataset fetch failed for ${snapshotId}: ${res.status} ${await res.text()}`);
    }

    return res.json();
  }

  throw new Error(`Timed out waiting for snapshot ${snapshotId}`);
}

/**
 * Triggers a collector against a list of product URLs and waits for results.
 * Retries the trigger step on transient failures — this is the layer that
 * benefits most from Scraper Studio's self-healing, since a layout change
 * on the target site is handled upstream and this just gets clean data back.
 */
export async function runCollector(collectorId: string, urls: string[]): Promise<RawScrapedRecord[]> {
  return withRetry(
    async () => {
      const snapshotId = await triggerCollector(collectorId, urls);
      logger.debug("Collector triggered", { collectorId, snapshotId });
      return pollDataset(snapshotId);
    },
    { attempts: 3, label: `collector:${collectorId}` }
  );
}
