-- ============================================================
--  TechShop — Database Init Script
--  Generated from source code analysis (NestJS + raw pg)
--  Run: psql -U postgres -d techshop -f techshop_init.sql
-- ============================================================

-- Extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100)        NOT NULL,
  email         VARCHAR(150)        NOT NULL UNIQUE,
  password_hash VARCHAR(255)        NOT NULL,
  role          VARCHAR(20)         NOT NULL DEFAULT 'customer', -- 'customer' | 'admin'
  created_at    TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200)    NOT NULL,
  price       NUMERIC(12, 2)  NOT NULL,
  description TEXT,
  year        INT,
  image_url   VARCHAR(500),
  stock       INT             NOT NULL DEFAULT 0,
  created_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. CARTS
-- ============================================================
CREATE TABLE IF NOT EXISTS carts (
  id         SERIAL PRIMARY KEY,
  user_id    INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status     VARCHAR(20)  NOT NULL DEFAULT 'active',  -- 'active' | 'ordered'
  created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. CART_ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id          SERIAL PRIMARY KEY,
  cart_id     INT  NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id  INT  NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INT  NOT NULL DEFAULT 1
);

-- ============================================================
-- 5. ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id           SERIAL PRIMARY KEY,
  user_id      INT             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status       VARCHAR(20)     NOT NULL DEFAULT 'pending', -- 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  address      TEXT            NOT NULL,
  total_price  NUMERIC(12, 2)  NOT NULL,
  created_at   TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. ORDER_ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INT             NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  INT             NOT NULL REFERENCES products(id) ON DELETE SET NULL,
  quantity    INT             NOT NULL,
  price       NUMERIC(12, 2)  NOT NULL  -- snapshot giá tại thời điểm đặt hàng
);

-- ============================================================
-- INDEXES (tối ưu query thường dùng)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_carts_user_id         ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_status          ON carts(status);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id    ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id        ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id  ON order_items(order_id);

-- ============================================================
-- SEED DATA — dùng để test local
-- ============================================================

-- Admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Admin', 'admin@techshop.com', crypt('admin123', gen_salt('bf')), 'admin')
ON CONFLICT (email) DO NOTHING;

-- Sample customer
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Nguyen Van A', 'user@techshop.com', crypt('user123', gen_salt('bf')), 'customer')
ON CONFLICT (email) DO NOTHING;

-- Sample products
INSERT INTO products (name, price, description, year, stock) VALUES
  ('iPhone 15 Pro',    28990000, 'Apple iPhone 15 Pro 256GB',       2024, 50),
  ('Samsung Galaxy S24', 22990000, 'Samsung Galaxy S24 128GB',      2024, 40),
  ('MacBook Air M3',   32990000, 'Apple MacBook Air 13 inch M3',    2024, 20),
  ('Dell XPS 15',      45990000, 'Dell XPS 15 OLED i9 32GB',        2024, 15),
  ('AirPods Pro 2',     6490000, 'Apple AirPods Pro 2nd Generation', 2024, 100)
ON CONFLICT DO NOTHING;