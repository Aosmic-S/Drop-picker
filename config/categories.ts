import type { Category } from "../scrapers/types/product.js";

export const CATEGORIES: Record<Category, { label: string }> = {
  ram: { label: "RAM" },
  pc_parts: { label: "PC Parts" },
  games: { label: "Games" },
  consoles: { label: "Consoles" },
  machinery: { label: "Machinery" },
};
