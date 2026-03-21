import pool from "@/lib/db";

let ensureCoreTablesPromise = null;

const ensureCoreTablesInternal = async () => {
  await pool.query("CREATE EXTENSION IF NOT EXISTS pgcrypto;");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_users (
      id TEXT PRIMARY KEY,
      username VARCHAR(30) NOT NULL,
      email VARCHAR(120) NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_login_at TIMESTAMPTZ
    );
  `);

  await pool.query(`
    ALTER TABLE app_users
    ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS app_users_username_lower_unique_idx
    ON app_users ((LOWER(username)));
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS app_users_email_lower_unique_idx
    ON app_users ((LOWER(email)));
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      price INTEGER NOT NULL,
      category VARCHAR(50) NOT NULL DEFAULT 'Main Course',
      description TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    ALTER TABLE menu_items
    ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
  `);

  await pool.query(`
    ALTER TABLE menu_items
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      table_number INTEGER,
      order_type VARCHAR(20),
      status VARCHAR(20) DEFAULT 'Pending',
      payment_status VARCHAR(20),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      session_id UUID NOT NULL DEFAULT gen_random_uuid(),
      table_no TEXT NOT NULL DEFAULT 'NA',
      customer_name TEXT NOT NULL DEFAULT 'Walk-in',
      customer_mobile TEXT NOT NULL DEFAULT '-',
      total NUMERIC NOT NULL DEFAULT 0,
      payment_method TEXT NOT NULL DEFAULT 'UPI',
      payment_id TEXT NOT NULL DEFAULT '-',
      invoice_id TEXT NOT NULL DEFAULT '',
      invoice_generated_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      payment_transferred BOOLEAN NOT NULL DEFAULT FALSE,
      payment_transferred_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      order_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id BIGSERIAL PRIMARY KEY,
      order_id TEXT NOT NULL,
      item_id INTEGER,
      item_name VARCHAR(200) NOT NULL,
      quantity INTEGER NOT NULL,
      price NUMERIC NOT NULL,
      kitchen_status VARCHAR(30),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      name TEXT NOT NULL DEFAULT '',
      qty INTEGER NOT NULL DEFAULT 1,
      line_total NUMERIC NOT NULL DEFAULT 0,
      position INTEGER NOT NULL DEFAULT 0
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS order_items_order_id_idx
    ON order_items (order_id);
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS inventory_items (
      id TEXT PRIMARY KEY,
      name VARCHAR(80) NOT NULL,
      category VARCHAR(80) NOT NULL,
      current_stock INTEGER NOT NULL DEFAULT 0,
      min_stock INTEGER NOT NULL DEFAULT 0,
      unit VARCHAR(12) NOT NULL DEFAULT 'kg',
      price_per_unit NUMERIC(12, 2) NOT NULL DEFAULT 0,
      supplier VARCHAR(80) NOT NULL DEFAULT '',
      last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS inventory_items_last_updated_idx
    ON inventory_items (last_updated DESC);
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL DEFAULT '',
      customer_name VARCHAR(80) NOT NULL DEFAULT 'Walk-in',
      customer_mobile VARCHAR(20) NOT NULL DEFAULT '-',
      table_no VARCHAR(20) NOT NULL DEFAULT 'NA',
      amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
      payment_method VARCHAR(20) NOT NULL DEFAULT 'UPI',
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      payment_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      transaction_id VARCHAR(80) NOT NULL DEFAULT '',
      upi_id VARCHAR(80) NOT NULL DEFAULT '',
      items JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS payments_order_id_unique_idx
    ON payments (order_id)
    WHERE order_id <> '';
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS payments_payment_timestamp_idx
    ON payments (payment_timestamp DESC);
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS reservation_settings (
      id SMALLINT PRIMARY KEY DEFAULT 1,
      payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT reservation_settings_singleton CHECK (id = 1)
    );
  `);
};

export const ensureCoreTables = async () => {
  if (!ensureCoreTablesPromise) {
    ensureCoreTablesPromise = ensureCoreTablesInternal().catch((error) => {
      ensureCoreTablesPromise = null;
      throw error;
    });
  }

  return ensureCoreTablesPromise;
};
