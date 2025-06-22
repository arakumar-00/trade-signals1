/*
  # Create signals table for Gold & Silver trading app

  1. New Tables
    - `signals`
      - `id` (uuid, primary key)
      - `pair` (text) - Trading pair like XAU/USD, XAG/USD
      - `type` (text) - BUY or SELL
      - `entry_price` (numeric) - Entry price for the signal
      - `current_price` (numeric, nullable) - Current market price
      - `take_profit_levels` (numeric array) - Multiple TP levels
      - `stop_loss` (numeric) - Stop loss level
      - `status` (text) - active, closed, or pending
      - `accuracy` (numeric) - Signal accuracy percentage
      - `timestamp` (timestamptz) - When signal was created
      - `description` (text, nullable) - Signal description
      - `risk_reward` (text, nullable) - Risk to reward ratio
      - `pnl` (numeric, nullable) - Profit and loss
      - `created_at` (timestamptz) - Record creation time

  2. Security
    - Enable RLS on `signals` table
    - Add policy for public read access (demo purposes)
    - Add policy for public insert access (demo purposes)

  3. Sample Data
    - Insert realistic Gold and Silver trading signals
    - Mix of active, closed, and pending signals
*/

CREATE TABLE IF NOT EXISTS signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pair text NOT NULL,
  type text NOT NULL CHECK (type IN ('BUY', 'SELL')),
  entry_price numeric NOT NULL,
  current_price numeric,
  take_profit_levels numeric[] NOT NULL,
  stop_loss numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'closed', 'pending')),
  accuracy numeric NOT NULL DEFAULT 0,
  timestamp timestamptz DEFAULT now(),
  description text,
  risk_reward text,
  pnl numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;

-- Allow public read access for demo purposes
CREATE POLICY "Allow public read access on signals"
  ON signals
  FOR SELECT
  TO public
  USING (true);

-- Allow public insert for demo purposes (you might want to restrict this in production)
CREATE POLICY "Allow public insert on signals"
  ON signals
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Insert sample Gold and Silver signals
INSERT INTO signals (
  pair, type, entry_price, current_price, take_profit_levels, stop_loss, status, accuracy, description, risk_reward, pnl
) VALUES
  ('XAU/USD', 'BUY', 2345.67, 2352.34, ARRAY[2360.00, 2375.00, 2390.00], 2330.00, 'active', 85.2, 'Gold showing strong bullish momentum after Fed dovish comments. Technical breakout above key resistance.', '1:3', 245.00),
  ('XAG/USD', 'SELL', 29.45, 28.92, ARRAY[28.20, 27.80, 27.50], 30.20, 'active', 76.8, 'Silver showing bearish divergence on H4. Expecting correction to support levels.', '1:2.5', 265.00),
  ('XAU/USD', 'BUY', 2334.56, 2321.45, ARRAY[2350.00, 2365.00], 2320.00, 'active', 68.4, 'Gold consolidation breakout expected. Strong support at current levels.', '1:2', -175.00),
  ('XAG/USD', 'SELL', 30.78, NULL, ARRAY[30.20, 29.80], 31.20, 'closed', 92.1, 'Silver weakness on industrial demand concerns. Target achieved successfully.', '1:1.8', 290.00),
  ('XAU/USD', 'BUY', 2340.01, NULL, ARRAY[2355.00, 2370.00], 2325.00, 'pending', 74.3, 'Gold bullish setup forming. Waiting for entry confirmation at key level.', '1:2.2', NULL),
  ('XAU/USD', 'SELL', 2380.45, NULL, ARRAY[2365.00, 2350.00], 2395.00, 'closed', 88.7, 'Gold reversal from resistance. Perfect execution to target levels.', '1:2.1', 425.00);