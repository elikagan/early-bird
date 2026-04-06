-- Seed real market event
INSERT INTO markets (name, market_date, drop_time)
VALUES ('Downtown Modernism', '2026-04-26', '2026-04-23T19:00:00Z')
ON CONFLICT DO NOTHING;
