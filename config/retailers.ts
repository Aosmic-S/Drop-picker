import type { Retailer } from "../scrapers/types/product.js";

export const RETAILERS: Record<Retailer, { label: string; currency: string }> = {
  newegg: { label: "Newegg", currency: "USD" },
  bestbuy: { label: "Best Buy", currency: "USD" },
  walmart: { label: "Walmart", currency: "USD" },
  microcenter: { label: "Micro Center", currency: "USD" },
  steam: { label: "Steam", currency: "USD" },
  gog: { label: "GOG", currency: "USD" },
};
