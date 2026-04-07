CREATE TABLE IF NOT EXISTS market_booths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID REFERENCES dealers(id) NOT NULL,
  market_id UUID REFERENCES markets(id) NOT NULL,
  booth_number TEXT,
  payment_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(dealer_id, market_id)
);

ALTER TABLE market_booths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON market_booths FOR ALL USING (true) WITH CHECK (true);
