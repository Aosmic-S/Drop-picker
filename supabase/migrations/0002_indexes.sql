-- Speeds up the two hot paths: "latest snapshot per product" and "recent alerts"

create index if not exists price_snapshots_product_id_scraped_at_idx
  on price_snapshots (product_id, scraped_at desc);

create index if not exists alerts_triggered_at_idx
  on alerts (triggered_at desc);

create index if not exists products_retailer_category_idx
  on products (retailer, category);
