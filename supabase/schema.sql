-- CanteenGo Supabase Schema

-- Create profiles table for user profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  role text check (role in ('student', 'manager'))
);

-- Create categories table
create table categories (
  id bigint primary key generated always as identity,
  name text not null,
  description text,
  image_url text,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Create menu_items table
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

-- Create tables table for physical tables
create table tables (
  id bigint primary key generated always as identity,
  table_number integer not null unique,
  is_active boolean default true,
  last_scanned_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Create orders table
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

-- Create banners table
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

-- Create daily_sequences table
create table daily_sequences (
  id bigint primary key generated always as identity,
  date date not null,
  last_sequence integer default 0
);

-- Seed data
-- Create categories
INSERT INTO categories (name, description) VALUES 
  ('Meals', 'Main course meals and thalis'),
  ('Snacks', 'Quick bites and snacks'),
  ('Drinks', 'Hot and cold beverages'),
  ('Beverages', 'Refreshing drinks and shakes');

-- Create menu items
INSERT INTO menu_items (name, category_id, description, price, image_url) VALUES 
  ('Veg Thali', 1, 'Delicious veg thali with sabzi, dal, rice', 80.00, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=400&fit=crop'),
  ('Chicken Thali', 1, 'Tasty chicken thali with curry and rice', 120.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=400&fit=crop'),
  ('Dal Rice', 1, 'Hot dal with steamed rice', 60.00, 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=400&fit=crop'),
  ('Rajma Chawal', 1, 'Rich rajma with jeera rice', 70.00, 'https://images.unsplash.com/photo-1596097635121-14b63b7f0c19?w=400&h=400&fit=crop');

-- Create tables
INSERT INTO tables (table_number, is_active) VALUES 
  (1, true),
  (2, true),
  (3, true),
  (4, true),
  (5, true);

-- Create banners
INSERT INTO banners (title, description, image_url, is_active) VALUES 
  ('50% OFF on Thalis', 'Get 50% off on all thali orders today only', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop', true),
  ('Buy 1 Get 1 Free - Puffs', 'Buy any veg puff and get one free', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=400&fit=crop', true),
  ('Cold Drinks Combo', 'Get 20% off on cold drinks combo', 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=800&h=400&fit=crop', true);

-- Create demo users
-- These would be created in Supabase Auth, not in database
-- student@demo.com -> role: student
-- manager@demo.com -> role: manager