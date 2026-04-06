-- Simplify conversations: no relay numbers needed
-- Messages go through web UI, SMS is notification-only

-- Drop old constraints and columns
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_relay_number_seller_id_key;
DROP INDEX IF EXISTS idx_conversations_relay_seller;

-- Remove relay_number (no longer needed — one Early Bird number for notifications)
ALTER TABLE conversations DROP COLUMN IF EXISTS relay_number;

-- Add a conversation token for the reply link (earlybird.com/c/xK7mP2nQ)
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS token TEXT UNIQUE;

-- Update messages: sender is now a dealer_id, not a phone number
ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender_id UUID REFERENCES dealers(id);
ALTER TABLE messages ALTER COLUMN sender_phone DROP NOT NULL;

-- Index on conversation token for fast lookups
CREATE INDEX IF NOT EXISTS idx_conversations_token ON conversations(token) WHERE active = true;

-- Unique constraint: one active conversation per buyer+item
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_buyer_item_active
  ON conversations(buyer_id, item_id) WHERE active = true;

-- Seed test data: test market event + test dealers
INSERT INTO markets (name, market_date, drop_time)
VALUES ('TEST EVENT - Do Not Use', '2026-04-20', '2026-04-17T19:00:00Z')
ON CONFLICT DO NOTHING;
