// Usage: npx tsx scripts/test-collector.ts newegg
import "dotenv/config";
import { runCollector } from "../scrapers/lib/brightdata.js";
import { normalizeBatch } from "../scrapers/lib/normalizer.js";
import { COLLECTORS } from "../config/collectors.js";

async function main() {
  const retailer = process.argv[2];
  if (!retailer) {
    console.error("Usage: npx tsx scripts/test-collector.ts <retailer>");
    process.exit(1);
  }

  const config = COLLECTORS.find((c) => c.retailer === retailer);
  if (!config) {
    console.error(`Unknown retailer "${retailer}". Options: ${COLLECTORS.map((c) => c.retailer).join(", ")}`);
    process.exit(1);
  }

  if (!config.collectorId || config.urls.length === 0) {
    console.error(`"${retailer}" has no collector ID or URLs configured yet.`);
    process.exit(1);
  }

  console.log(`Running ${retailer} against ${config.urls.length} URL(s)...`);
  const raw = await runCollector(config.collectorId, config.urls);
  const records = normalizeBatch(raw, (r, err) => console.warn(`Skipped ${r.url}: ${err}`));

  console.log(`\nGot ${records.length}/${raw.length} usable records:\n`);
  console.table(records);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
