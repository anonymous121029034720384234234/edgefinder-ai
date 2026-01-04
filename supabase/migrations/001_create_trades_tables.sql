-- Create uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  trade_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'parsed', -- parsed, processing, completed, failed
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create trades table (matched BUY/SELL pairs)
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  entry_price DECIMAL(18, 8) DEFAULT 0,
  exit_price DECIMAL(18, 8) DEFAULT 0,
  pnl DECIMAL(18, 8) DEFAULT 0,
  trade_date TIMESTAMP,
  quantity DECIMAL(18, 8) DEFAULT 0,
  platform TEXT, -- ThinkorSwim, Interactive Brokers, Robinhood, etc.
  raw_data JSONB, -- Store the original parsed data
  created_at TIMESTAMP DEFAULT now()
);

-- Create transactions table (individual BUY/SELL transactions)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
  upload_id UUID NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  side TEXT, -- BUY or SELL
  quantity DECIMAL(18, 8),
  price DECIMAL(18, 8),
  commission DECIMAL(18, 8) DEFAULT 0,
  exec_time TIMESTAMP,
  raw_data JSONB, -- Store the original transaction data
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_uploads_clerk_user_id ON uploads(clerk_user_id);
CREATE INDEX idx_trades_upload_id ON trades(upload_id);
CREATE INDEX idx_trades_symbol ON trades(symbol);
CREATE INDEX idx_trades_trade_date ON trades(trade_date);
CREATE INDEX idx_transactions_trade_id ON transactions(trade_id);
CREATE INDEX idx_transactions_upload_id ON transactions(upload_id);
CREATE INDEX idx_transactions_symbol ON transactions(symbol);
CREATE INDEX idx_transactions_exec_time ON transactions(exec_time);

-- Enable RLS
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own uploads" ON uploads;
DROP POLICY IF EXISTS "Service role can insert uploads" ON uploads;
DROP POLICY IF EXISTS "Service role can update uploads" ON uploads;
DROP POLICY IF EXISTS "Users can view trades" ON trades;
DROP POLICY IF EXISTS "Service role can insert trades" ON trades;
DROP POLICY IF EXISTS "Service role can update trades" ON trades;
DROP POLICY IF EXISTS "Users can view transactions" ON transactions;
DROP POLICY IF EXISTS "Service role can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Service role can update transactions" ON transactions;

-- RLS Policies for uploads
CREATE POLICY "Users can view their own uploads"
  ON uploads FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert uploads"
  ON uploads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update uploads"
  ON uploads FOR UPDATE
  WITH CHECK (true);

-- RLS Policies for trades
CREATE POLICY "Users can view trades"
  ON trades FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert trades"
  ON trades FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update trades"
  ON trades FOR UPDATE
  WITH CHECK (true);

-- RLS Policies for transactions
CREATE POLICY "Users can view transactions"
  ON transactions FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert transactions"
  ON transactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update transactions"
  ON transactions FOR UPDATE
  WITH CHECK (true);
