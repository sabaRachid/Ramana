CREATE TABLE IF NOT EXISTS ramana_orders (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  total INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
