export type Category = "ram" | "pc_parts" | "games" | "consoles" | "machinery";

export type Retailer = "newegg" | "bestbuy" | "walmart" | "microcenter" | "steam" | "gog";

export interface Product {
  id: string;
  name: string;
  category: Category;
  retailer: Retailer;
  url: string;
  imageUrl?: string;
}
