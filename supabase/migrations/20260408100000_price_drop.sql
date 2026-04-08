-- Track price history for price drop notifications
ALTER TABLE items ADD COLUMN IF NOT EXISTS previous_price INTEGER;

-- Function will be called by worker when price drops
