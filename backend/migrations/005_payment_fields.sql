-- Add payment tracking columns to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status  VARCHAR(30)   DEFAULT 'unpaid';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method  VARCHAR(30);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id      VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS amount_paid     NUMERIC(10,2);
