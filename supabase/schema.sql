-- CanteenGo Supabase Schema - Run this entire file in Supabase SQL Editor

-- 1. Create tables

create table categories (
  id bigint primary key generated always as identity,
  name text not null,
  description text,
  image_url text,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

create table menu_items (
  id bigint primary key generated always as identity,
  name text not null,
  category_id bigint references categories(id),
  description text,
  price numeric(10,2) not null,
  image_url text,
  is_available boolean default true,
  created_at timestamp with time zone default now()
);

create table tables (
  id bigint primary key generated always as identity,
  table_number integer not null unique,
  is_active boolean default true,
  last_scanned_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

create table orders (
  id bigint primary key generated always as identity,
  order_number text not null unique,
  table_number integer,
  user_id uuid references auth.users,
  items jsonb,
  total_amount numeric(10,2),
  payment_mode text,
  payment_status text default 'pending' check (payment_status in ('pending', 'collected', 'paid')),
  order_status text default 'placed' check (order_status in ('placed', 'preparing', 'ready', 'completed')),
  created_at timestamp with time zone default now()
);

create table banners (
  id bigint primary key generated always as identity,
  title text not null,
  description text,
  image_url text,
  valid_till date,
  is_active boolean default true,
  click_count integer default 0,
  created_at timestamp with time zone default now()
);

create table daily_sequences (
  id bigint primary key generated always as identity,
  date date not null,
  last_sequence integer default 0
);

-- 2. Seed categories

insert into categories (name, description, display_order) values 
  ('Meals', 'Main course meals and thalis', 1),
  ('Snacks', 'Quick bites and snacks', 2),
  ('Drinks', 'Hot beverages', 3),
  ('Beverages', 'Cold drinks and refreshments', 4);

-- 3. Seed menu items (12 items)

insert into menu_items (name, category_id, description, price, image_url) values 
  ('Veg Thali', 1, 'Delicious veg thali with sabzi, dal, rice', 80.00, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=400&fit=crop'),
  ('Chicken Thali', 1, 'Tasty chicken thali with curry and rice', 120.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=400&fit=crop'),
  ('Dal Rice', 1, 'Hot dal with steamed rice', 60.00, 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=400&fit=crop'),
  ('Rajma Chawal', 1, 'Rich rajma with jeera rice', 70.00, 'https://images.unsplash.com/photo-1596097635121-14b63b7f0c19?w=400&h=400&fit=crop'),
  ('Samosa (2pc)', 2, 'Crispy samosas with chutney', 20.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop'),
  ('Bread Pakoda', 2, 'Crispy bread pakoda', 30.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop'),
  ('Veg Puff', 2, 'Flaky veg puff pastry', 25.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop'),
  ('Poha', 2, 'Traditional poha with peanuts', 40.00, 'https://images.unsplash.com/photo-1630409351217-bc4fa6422075?w=400&h=400&fit=crop'),
  ('Chai', 3, 'Masala chai', 10.00, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop'),
  ('Coffee', 3, 'Hot coffee', 20.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop'),
  ('Lassi', 4, 'Sweet yogurt lassi', 40.00, 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=400&fit=crop'),
  ('Cold Coffee', 4, 'Creamy cold coffee', 50.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop');

-- 4. Seed tables (1-5)

insert into tables (table_number, is_active) values 
  (1, true),
  (2, true),
  (3, true),
  (4, true),
  (5, true);

-- 5. Seed banners

insert into banners (title, description, image_url, is_active) values 
  ('50% OFF on Thalis', 'Get 50% off on all thali orders today only', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop', true),
  ('Buy 1 Get 1 Free - Puffs', 'Buy any veg puff and get one free', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=400&fit=crop', true),
  ('Cold Drinks Combo', 'Get 20% off on cold drinks combo', 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=800&h=400&fit=crop', true);

-- 6. Create profiles table (links to auth.users)

create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  role text check (role in ('student', 'manager')),
  created_at timestamp with time zone default now()
);

-- 7. Enable Row Level Security

alter table profiles enable row level security;
alter table menu_items enable row level security;
alter table categories enable row level security;
alter table tables enable row level security;
alter table orders enable row level security;
alter table banners enable row level security;
alter table daily_sequences enable row level security;

-- 8. Create policies

-- Public read access for all users
create policy "Public read access" on menu_items for select using (true);
create policy "Public read access" on categories for select using (true);
create policy "Public read access" on banners for select using (true);
create policy "Public read access" on tables for select using (true);
create policy "Managers can view all orders" on orders for select using (exists (select 1 from profiles where id = auth.uid() and role = 'manager'));
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);

-- Order policies
create policy "Users can insert own orders" on orders for insert with check (auth.uid() = user_id);
create policy "Managers can update orders" on orders for update using (exists (select 1 from profiles where id = auth.uid() and role = 'manager'));

-- Menu item policies (manager only for writes)
create policy "Managers can insert menu items" on menu_items for insert
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'manager'));
create policy "Managers can update menu items" on menu_items for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'manager'));
create policy "Managers can delete menu items" on menu_items for delete
  using (exists (select 1 from profiles where id = auth.uid() and role = 'manager'));

-- Category policies (manager only)
create policy "Managers can insert categories" on categories for insert
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'manager'));
create policy "Managers can update categories" on categories for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'manager'));

-- Banner policies (manager only)
create policy "Managers can insert banners" on banners for insert
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'manager'));
create policy "Managers can update banners" on banners for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'manager'));

-- Table policies (manager only)
create policy "Managers can insert tables" on tables for insert
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'manager'));
create policy "Managers can update tables" on tables for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'manager'));
create policy "Managers can delete tables" on tables for delete
  using (exists (select 1 from profiles where id = auth.uid() and role = 'manager'));

-- Profile policies
create policy "Users can read own profile" on profiles for select
  using (auth.uid() = id or exists (select 1 from profiles where id = auth.uid() and role = 'manager'));

-- Note: Demo users have already been created via setup script.
-- student@demo.com -> role: student
-- manager@demo.com -> role: manager
