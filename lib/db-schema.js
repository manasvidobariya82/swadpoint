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
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'app_users'
          AND column_name = 'id'
          AND data_type <> 'text'
      ) THEN
        ALTER TABLE app_users ALTER COLUMN id TYPE TEXT USING id::text;
      END IF;

      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'app_users'
          AND column_name = 'name'
      ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'app_users'
          AND column_name = 'username'
      ) THEN
        ALTER TABLE app_users RENAME COLUMN name TO username;
      END IF;

      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'app_users'
          AND column_name = 'password'
      ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'app_users'
          AND column_name = 'password_hash'
      ) THEN
        ALTER TABLE app_users RENAME COLUMN password TO password_hash;
      END IF;
    END $$;
  `);

  await pool.query(`
    ALTER TABLE app_users
    ADD COLUMN IF NOT EXISTS id TEXT,
    ADD COLUMN IF NOT EXISTS username VARCHAR(30),
    ADD COLUMN IF NOT EXISTS email VARCHAR(120),
    ADD COLUMN IF NOT EXISTS password_hash TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
  `);

  await pool.query(`
    UPDATE app_users
    SET id = gen_random_uuid()::text
    WHERE id IS NULL OR TRIM(id) = '';
  `);

  await pool.query(`
    UPDATE app_users
    SET username = COALESCE(
      NULLIF(TRIM(username), ''),
      CONCAT('user_', SUBSTRING(MD5(COALESCE(id::text, RANDOM()::text)) FROM 1 FOR 8))
    )
    WHERE username IS NULL OR TRIM(username) = '';
  `);

  await pool.query(`
    UPDATE app_users
    SET email = COALESCE(
      NULLIF(TRIM(email), ''),
      CONCAT('user_', SUBSTRING(MD5(COALESCE(id::text, RANDOM()::text)) FROM 1 FOR 8), '@example.com')
    )
    WHERE email IS NULL OR TRIM(email) = '';
  `);

  await pool.query(`
    UPDATE app_users
    SET created_at = NOW()
    WHERE created_at IS NULL;
  `);

  await pool.query(`
    DELETE FROM app_users
    WHERE password_hash IS NULL OR TRIM(password_hash) = '';
  `);

  await pool.query(`
    ALTER TABLE app_users
    ALTER COLUMN id SET NOT NULL,
    ALTER COLUMN username SET NOT NULL,
    ALTER COLUMN email SET NOT NULL,
    ALTER COLUMN password_hash SET NOT NULL,
    ALTER COLUMN created_at SET NOT NULL;
  `);

  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'app_users'::regclass
          AND contype = 'p'
      ) THEN
        ALTER TABLE app_users ADD PRIMARY KEY (id);
      END IF;
    END $$;
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
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'orders'
          AND column_name = 'id'
          AND data_type <> 'text'
      ) THEN
        ALTER TABLE orders ALTER COLUMN id TYPE TEXT USING id::text;
      END IF;
    END $$;
  `);

  await pool.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS table_number INTEGER,
    ADD COLUMN IF NOT EXISTS order_type VARCHAR(20),
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Pending',
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20),
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS session_id UUID DEFAULT gen_random_uuid(),
    ADD COLUMN IF NOT EXISTS table_no TEXT DEFAULT 'NA',
    ADD COLUMN IF NOT EXISTS customer_name TEXT DEFAULT 'Walk-in',
    ADD COLUMN IF NOT EXISTS customer_mobile TEXT DEFAULT '-',
    ADD COLUMN IF NOT EXISTS total NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'UPI',
    ADD COLUMN IF NOT EXISTS payment_id TEXT DEFAULT '-',
    ADD COLUMN IF NOT EXISTS invoice_id TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS invoice_generated_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS payment_transferred BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS payment_transferred_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS order_time TIMESTAMPTZ DEFAULT NOW();
  `);

  await pool.query(`
    UPDATE orders
    SET
      status = COALESCE(NULLIF(TRIM(status), ''), 'Pending'),
      created_at = COALESCE(created_at, NOW()),
      table_no = COALESCE(NULLIF(TRIM(table_no), ''), 'NA'),
      customer_name = COALESCE(NULLIF(TRIM(customer_name), ''), 'Walk-in'),
      customer_mobile = COALESCE(NULLIF(TRIM(customer_mobile), ''), '-'),
      total = COALESCE(total, 0),
      payment_method = COALESCE(NULLIF(TRIM(payment_method), ''), 'UPI'),
      payment_id = COALESCE(NULLIF(TRIM(payment_id), ''), '-'),
      invoice_id = COALESCE(invoice_id, ''),
      payment_transferred = COALESCE(payment_transferred, FALSE),
      updated_at = COALESCE(updated_at, created_at, NOW()),
      order_time = COALESCE(order_time, created_at, NOW())
    WHERE
      status IS NULL OR TRIM(status) = ''
      OR created_at IS NULL
      OR table_no IS NULL OR TRIM(table_no) = ''
      OR customer_name IS NULL OR TRIM(customer_name) = ''
      OR customer_mobile IS NULL OR TRIM(customer_mobile) = ''
      OR total IS NULL
      OR payment_method IS NULL OR TRIM(payment_method) = ''
      OR payment_id IS NULL OR TRIM(payment_id) = ''
      OR invoice_id IS NULL
      OR payment_transferred IS NULL
      OR updated_at IS NULL
      OR order_time IS NULL;
  `);

  await pool.query(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'orders_items'
      ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'order_items'
      ) THEN
        ALTER TABLE orders_items RENAME TO order_items;
      END IF;

      IF EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
          AND indexname = 'orders_items_order_id_idx'
      ) AND NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
          AND indexname = 'order_items_order_id_idx'
      ) THEN
        ALTER INDEX orders_items_order_id_idx RENAME TO order_items_order_id_idx;
      END IF;
    END $$;
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
    ALTER TABLE order_items
    ADD COLUMN IF NOT EXISTS order_id TEXT,
    ADD COLUMN IF NOT EXISTS item_id INTEGER,
    ADD COLUMN IF NOT EXISTS item_name VARCHAR(200),
    ADD COLUMN IF NOT EXISTS quantity INTEGER,
    ADD COLUMN IF NOT EXISTS price NUMERIC,
    ADD COLUMN IF NOT EXISTS kitchen_status VARCHAR(30),
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS name TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS qty INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS line_total NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
  `);

  await pool.query(`
    UPDATE order_items
    SET
      item_name = COALESCE(NULLIF(TRIM(item_name), ''), NULLIF(TRIM(name), ''), 'Item'),
      quantity = COALESCE(quantity, qty, 1),
      price = COALESCE(price, 0),
      created_at = COALESCE(created_at, NOW()),
      name = COALESCE(NULLIF(TRIM(name), ''), NULLIF(TRIM(item_name), ''), 'Item'),
      qty = COALESCE(qty, quantity, 1),
      line_total = COALESCE(line_total, COALESCE(price, 0) * COALESCE(quantity, qty, 1), 0),
      position = COALESCE(position, 0)
    WHERE
      item_name IS NULL OR TRIM(item_name) = ''
      OR quantity IS NULL
      OR price IS NULL
      OR created_at IS NULL
      OR name IS NULL OR TRIM(name) = ''
      OR qty IS NULL
      OR line_total IS NULL
      OR position IS NULL;
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
    ALTER TABLE payments
    ADD COLUMN IF NOT EXISTS order_id TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS customer_name VARCHAR(80) DEFAULT 'Walk-in',
    ADD COLUMN IF NOT EXISTS customer_mobile VARCHAR(20) DEFAULT '-',
    ADD COLUMN IF NOT EXISTS table_no VARCHAR(20) DEFAULT 'NA',
    ADD COLUMN IF NOT EXISTS amount NUMERIC(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'UPI',
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS payment_timestamp TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(80) DEFAULT '',
    ADD COLUMN IF NOT EXISTS upi_id VARCHAR(80) DEFAULT '',
    ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
  `);

  await pool.query(`
    UPDATE payments
    SET
      order_id = COALESCE(order_id, ''),
      customer_name = COALESCE(NULLIF(TRIM(customer_name), ''), 'Walk-in'),
      customer_mobile = COALESCE(NULLIF(TRIM(customer_mobile), ''), '-'),
      table_no = COALESCE(NULLIF(TRIM(table_no), ''), 'NA'),
      amount = COALESCE(amount, 0),
      payment_method = COALESCE(NULLIF(TRIM(payment_method), ''), 'UPI'),
      status = COALESCE(NULLIF(TRIM(status), ''), 'pending'),
      payment_timestamp = COALESCE(payment_timestamp, NOW()),
      transaction_id = COALESCE(transaction_id, ''),
      upi_id = COALESCE(upi_id, ''),
      items = COALESCE(items, '[]'::jsonb),
      created_at = COALESCE(created_at, NOW())
    WHERE
      order_id IS NULL
      OR customer_name IS NULL OR TRIM(customer_name) = ''
      OR customer_mobile IS NULL OR TRIM(customer_mobile) = ''
      OR table_no IS NULL OR TRIM(table_no) = ''
      OR amount IS NULL
      OR payment_method IS NULL OR TRIM(payment_method) = ''
      OR status IS NULL OR TRIM(status) = ''
      OR payment_timestamp IS NULL
      OR transaction_id IS NULL
      OR upi_id IS NULL
      OR items IS NULL
      OR created_at IS NULL;
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
