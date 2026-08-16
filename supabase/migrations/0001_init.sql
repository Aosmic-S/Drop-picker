-- Drop Picker core schema
-- Run via: supabase db push  (or paste into the Supabase SQL editor)

create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  category     text not null check (category in ('ram', 'pc_parts', 'games', 'consoles', 'machinery')),
  retailer     text not null check (retailer in ('newegg', 'bestbuy', 'walmart', 'microcenter', 'steam', 'gog')),
  url          text not null unique,
  image_url    text,
  created_at   timestamptz not null default now()
);

create table if not exists price_snapshots (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references products(id) on delete cascade,
  price_cents  integer not null,
  in_stock     boolean not null,
  scraped_at   timestamptz not null default now()
);

create table if not exists alerts (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references products(id) on delete cascade,
  type         text not null check (type in ('price_drop', 'restock')),
  old_value    text,
  new_value    text,
  triggered_at timestamptz not null default now(),
  notified     boolean not null default false
);
