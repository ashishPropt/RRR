-- Admin users table (replaces env-var auth)
CREATE TABLE IF NOT EXISTS admin_users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username     VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);

-- Orders table (shopping cart submissions)
CREATE TABLE IF NOT EXISTS orders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(30),
  shipping_address TEXT,
  items        JSONB NOT NULL,          -- [{id,type,title,price,quantity,isSigned}]
  subtotal     NUMERIC(10,2) NOT NULL,
  notes        TEXT,
  status       VARCHAR(30) DEFAULT 'pending',  -- pending | processing | shipped | completed
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_email_idx  ON orders(customer_email);
