-- Sample data so the dashboard has something to show before real scrapes run.
-- Run this manually in the SQL editor when you want demo data — not part of migrations.

insert into products (name, category, retailer, url, image_url) values
  ('Corsair Vengeance 32GB DDR5', 'ram', 'newegg', 'https://www.newegg.com/example-ram', null),
  ('PlayStation 5 Slim', 'consoles', 'bestbuy', 'https://www.bestbuy.com/example-ps5', null),
  ('Baldur''s Gate 3', 'games', 'steam', 'https://store.steampowered.com/example-bg3', null)
on conflict (url) do nothing;

-- One snapshot per product so the dashboard has an initial price to display
insert into price_snapshots (product_id, price_cents, in_stock)
select id, 12999, true from products where url = 'https://www.newegg.com/example-ram'
union all
select id, 49999, false from products where url = 'https://www.bestbuy.com/example-ps5'
union all
select id, 5999, true from products where url = 'https://store.steampowered.com/example-bg3';
