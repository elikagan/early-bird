-- Early Bird — Database Schema
-- Pre-market marketplace for flea market dealers + buyers

-- Dealers (also serves as buyers — role column distinguishes)
CREATE TABLE dealers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  business_name TEXT,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'dealer')),
  photo_url TEXT,              -- selfie from onboarding
  venmo TEXT,
  zelle TEXT,
  booth_number TEXT,           -- e.g. "E25", confirmable per event
  show_name_on_sold BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Markets (flea market events with date + coordinated drop time)
CREATE TABLE markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  market_date DATE NOT NULL,
  drop_time TIMESTAMPTZ,       -- when inventory becomes visible
  is_test BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Items (listings posted by dealers for a specific market)
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID NOT NULL REFERENCES dealers(id),
  market_id UUID NOT NULL REFERENCES markets(id),
  title TEXT,                  -- optional
  price INTEGER NOT NULL,      -- cents
  condition TEXT CHECK (condition IN ('mint', 'good', 'fair', 'as-is')),
  firm BOOLEAN DEFAULT false,
  price_posture TEXT DEFAULT 'firm' CHECK (price_posture IN ('firm', 'flexible', 'make-offer')),
  notes TEXT,
  category TEXT CHECK (category IN ('art', 'objects', 'furniture', 'decor', 'lighting')),
  status TEXT DEFAULT 'live' CHECK (status IN ('live', 'hold', 'sold')),
  buyer_id UUID REFERENCES dealers(id),
  posted_by_admin BOOLEAN DEFAULT false,
  photos TEXT[] NOT NULL,      -- CDN URLs
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

-- Favorites (buyer saves items)
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID NOT NULL REFERENCES dealers(id),
  item_id UUID NOT NULL REFERENCES items(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(dealer_id, item_id)
);

-- Conversations (buyer-seller about a specific item)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES items(id),
  buyer_id UUID NOT NULL REFERENCES dealers(id),
  seller_id UUID NOT NULL REFERENCES dealers(id),
  token TEXT UNIQUE NOT NULL,  -- auth token for link-based access
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages (within conversations)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  sender_id UUID NOT NULL REFERENCES dealers(id),
  sender_phone TEXT NOT NULL,
  body TEXT NOT NULL,
  direction TEXT CHECK (direction IN ('buyer_to_seller', 'seller_to_buyer')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SMS Blasts (log of admin SMS broadcasts)
CREATE TABLE sms_blasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES markets(id),
  audience TEXT NOT NULL CHECK (audience IN ('buyers', 'sellers', 'all')),
  message TEXT NOT NULL,
  sent_count INTEGER DEFAULT 0,
  fail_count INTEGER DEFAULT 0,
  total_count INTEGER DEFAULT 0,
  errors JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin audit log
CREATE TABLE admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_dealers_phone ON dealers(phone);
CREATE INDEX idx_items_market_status ON items(market_id, status);
CREATE INDEX idx_items_dealer ON items(dealer_id);
CREATE INDEX idx_items_created ON items(created_at DESC);
CREATE INDEX idx_favorites_dealer ON favorites(dealer_id);
CREATE INDEX idx_favorites_item ON favorites(item_id);
CREATE INDEX idx_conversations_buyer ON conversations(buyer_id);
CREATE INDEX idx_conversations_seller ON conversations(seller_id);
CREATE INDEX idx_conversations_token ON conversations(token);
CREATE INDEX idx_conversations_item ON conversations(item_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_auth_tokens_token ON auth_tokens(token) WHERE used = false;
CREATE INDEX idx_sms_blasts_created ON sms_blasts(created_at DESC);
CREATE INDEX idx_admin_actions_created ON admin_actions(created_at DESC);
CREATE INDEX idx_admin_actions_entity ON admin_actions(entity_type, entity_id);

-- Enable RLS (service role bypasses, worker handles all auth)
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_blasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can read markets" ON markets FOR SELECT USING (true);
CREATE POLICY "Anyone can read live items" ON items FOR SELECT USING (true);
