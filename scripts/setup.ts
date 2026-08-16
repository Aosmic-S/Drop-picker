import "dotenv/config";
import { COLLECTORS, isConfigured } from "../config/collectors.js";

const REQUIRED = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "BRIGHTDATA_API_TOKEN"];

function check() {
  console.log("Drop Picker setup check\n------------------------");

  let ok = true;
  for (const key of REQUIRED) {
    const present = Boolean(process.env[key]);
    console.log(`${present ? "✓" : "✗"} ${key}`);
    if (!present) ok = false;
  }

  console.log("\nCollectors:");
  for (const c of COLLECTORS) {
    console.log(`${isConfigured(c) ? "✓" : "○"} ${c.retailer} — ${c.urls.length} URL(s)`);
  }

  if (!process.env.DISCORD_WEBHOOK_URL) {
    console.log("\n○ DISCORD_WEBHOOK_URL not set — alerts will log only, not notify.");
  }

  if (!ok) {
    console.log("\nMissing required environment variables. Copy .env.example to .env and fill it in.");
    process.exitCode = 1;
  } else {
    console.log("\nAll required environment variables are set.");
  }
}

check();
