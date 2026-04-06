-- Early Bird — Database Schema
-- Dealer-to-dealer pre-market marketplace

-- Dealers (invite-only, authenticated via phone magic link)
CREATE TABLE dealers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  business_name TEXT,
  venmo TEXT,
  zelle TEXT,
  show_name_on_sold BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Markets (flea market events with date + optional coordinated drop time)
CREATE TABLE markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  market_date DATE NOT NULL,
  drop_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Items (listings posted by dealers for a specific market)
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID NOT NULL REFERENCES dealers(id),
  market_id UUID NOT NULL REFERENCES markets(id),
  price INTEGER NOT NULL, -- cents
  condition TEXT CHECK (condition IN ('mint', 'good', 'fair', 'as-is')),
  firm BOOLEAN DEFAULT false,
  deposit_required BOOLEAN DEFAULT false,
  deposit_amount INTEGER, -- cents
  notes TEXT,
  category TEXT CHECK (category IN ('art', 'objects', 'furniture', 'decor', 'lighting')),
  status TEXT DEFAULT 'live' CHECK (status IN ('live', 'hold', 'sold')),
  buyer_id UUID REFERENCES dealers(id),
  posted_by_admin BOOLEAN DEFAULT false,
  photos TEXT[] NOT NULL, -- CDN URLs
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auth tokens (magic link tokens for phone auth)
CREATE TABLE auth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID NOT NULL REFERENCES dealers(id),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inquiries (logged when buyer taps "Text Seller")
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES items(id),
  buyer_id UUID NOT NULL REFERENCES dealers(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SMS relay conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES items(id),
  buyer_id UUID NOT NULL REFERENCES dealers(id),
  seller_id UUID NOT NULL REFERENCES dealers(id),
  relay_number TEXT NOT NULL, -- Telnyx number assigned to this conversation
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(relay_number, seller_id) -- each relay+seller pair maps to one buyer
);

-- SMS relay messages (all messages logged for admin visibility)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  sender_phone TEXT NOT NULL,
  body TEXT NOT NULL,
  direction TEXT CHECK (direction IN ('buyer_to_seller', 'seller_to_buyer')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_items_market_status ON items(market_id, status);
CREATE INDEX idx_items_dealer ON items(dealer_id);
CREATE INDEX idx_items_created ON items(created_at DESC);
CREATE INDEX idx_conversations_relay_seller ON conversations(relay_number, seller_id) WHERE active = true;
CREATE INDEX idx_conversations_buyer_item ON conversations(buyer_id, item_id);
CREATE INDEX idx_inquiries_item ON inquiries(item_id);
CREATE INDEX idx_auth_tokens_token ON auth_tokens(token) WHERE used = false;
CREATE INDEX idx_dealers_phone ON dealers(phone);

-- Enable RLS
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS policies (service role bypasses RLS, so the worker can do everything)
-- Public read for markets and live items (no auth needed to browse)
CREATE POLICY "Anyone can read markets" ON markets FOR SELECT USING (true);
CREATE POLICY "Anyone can read live items" ON items FOR SELECT USING (true);
