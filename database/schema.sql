-- ============================================
-- AETHERIS BOT — DATABASE SCHEMA
-- Database: Supabase (PostgreSQL)
-- ============================================


-- --------------------------------------------
-- TICKETS
-- Menyimpan data tiket support
-- --------------------------------------------

CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  ticket_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  channel_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);


-- --------------------------------------------
-- LEVELS
-- Data utama member: XP, level, coins, bank, equip, premium
-- --------------------------------------------

CREATE TABLE levels (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  bank INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  last_xp TIMESTAMP DEFAULT NOW(),
  last_daily TIMESTAMP,
  equipped_pancing TEXT DEFAULT 'pancing_bambu',
  equipped_umpan TEXT DEFAULT 'cacing',
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP
);

ALTER TABLE levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
ON levels FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users"
ON levels FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
ON levels FOR UPDATE TO authenticated USING (true);


-- --------------------------------------------
-- BADGES
-- Badge yang dimiliki member
-- --------------------------------------------

CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
ON badges FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users"
ON badges FOR INSERT TO authenticated WITH CHECK (true);


-- --------------------------------------------
-- GAME STATS
-- Riwayat hasil mini game (dice, coinflip, slot, blackjack, crash)
-- --------------------------------------------

CREATE TABLE game_stats (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  game_type TEXT NOT NULL,
  result TEXT NOT NULL,
  coins_change INTEGER DEFAULT 0,
  played_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
ON game_stats FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users"
ON game_stats FOR INSERT TO authenticated WITH CHECK (true);


-- --------------------------------------------
-- LOOTBOXES
-- Inventory loot box milik member (common, rare, legendary)
-- --------------------------------------------

CREATE TABLE lootboxes (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  box_type TEXT NOT NULL,
  opened BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE lootboxes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
ON lootboxes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users"
ON lootboxes FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
ON lootboxes FOR UPDATE TO authenticated USING (true);


-- --------------------------------------------
-- FISH INVENTORY
-- Ikan yang dimiliki member dari hasil memancing
-- --------------------------------------------

CREATE TABLE fish_inventory (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  fish_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, fish_id)
);

ALTER TABLE fish_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
ON fish_inventory FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users"
ON fish_inventory FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
ON fish_inventory FOR UPDATE TO authenticated USING (true);


-- --------------------------------------------
-- SHOP INVENTORY
-- Item yang dibeli member dari shop
-- --------------------------------------------

CREATE TABLE shop_inventory (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  purchased_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

ALTER TABLE shop_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated users"
ON shop_inventory FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users"
ON shop_inventory FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
ON shop_inventory FOR UPDATE TO authenticated USING (true);


-- --------------------------------------------
-- EVENTS
-- Event server: Double XP, Double Coins, Fishing Frenzy, Loot Rain
-- --------------------------------------------

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  multiplier FLOAT DEFAULT 1,
  ends_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users"
ON events FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- --------------------------------------------
-- ACTIVE BOOSTS
-- Boost aktif milik member: XP Boost, Coin Boost, Lucky Charm
-- --------------------------------------------

CREATE TABLE active_boosts (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  boost_type TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE active_boosts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users"
ON active_boosts FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- --------------------------------------------
-- PREMIUM KEYS
-- Redeem key untuk fitur premium
-- --------------------------------------------

CREATE TABLE premium_keys (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  duration TEXT NOT NULL, -- '1month', '3month', 'permanent'
  status TEXT DEFAULT 'unused', -- 'unused', 'used'
  used_by TEXT,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE premium_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users"
ON premium_keys FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- --------------------------------------------
-- TRANSACTIONS
-- Riwayat transaksi coin (gift, daily, beli item, dll)
-- --------------------------------------------

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users"
ON transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);