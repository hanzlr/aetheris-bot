# 📋 Changelog

All notable changes to the Aetheris Bot project will be documented here.

---
## [v1.1.1] - June 2026
### 🔒 Security
- Patched `undici` dependency vulnerabilities (HTTP header injection via Set-Cookie, WebSocket DoS, Set-Cookie SameSite downgrade, HTTP response queue poisoning) via package override
### 📚 Docs
- Added `database/schema.sql` with full SQL schema, linked from README

---

## [v1.1.0] - June 2026

### ✨ New Features
- ⭐ **Premium System** — Redeem a key via `/premium redeem`, check status via `/premium status`
- 💸 **Gift** — Transfer coins between members (Premium only)
- 📊 **Transaction History** — Coin transaction history via `/history` (Premium only)
- 🚀 **Game Crash** — Multiplier mini game with interactive cashout (Premium only)
- 🔔 **Premium Expiry Notification** — Automatic DM 1 day before premium expires
- 🎁 **Weekly Premium Loot Box** — Automatic rare box every Monday for premium members

### 🌐 Web Dashboard
- 🔑 Generate & delete premium keys
- 🔍 Search/filter members in the leaderboard

### 🛡️ Improvements
- API rate limiting (30 requests/minute per IP)
- Capped XP & coin multipliers at 3x (prevents stacking of event + boost + premium)
- Complete transaction logging across all coin sources (daily, games, fishing)

### 🗄️ Database
- `premium_keys` table — Premium redeem keys
- `transactions` table — Coin transaction history
- `is_premium` & `premium_expires_at` columns added to the `levels` table

---

## [v1.0.0] - June 2026

### 🎉 Initial Release

### ✨ New Features
- 🎫 **Ticket System** — Open ticket system with categories and a close button
- ⭐ **Leveling & XP** — Automatic leveling system from chat activity with a 1-minute cooldown
- 💰 **Economy System** — Daily reward (100–250 coins), wallet, and balance check
- 🏦 **Bank System** — Deposit, withdraw, and automatic 2% interest every Monday
- 🎮 **Mini Games** — Interactive Dice, Coinflip, Slot Machine, and Blackjack
- 🏅 **Badge System** — Automatic badges from activity and exclusive badges from the shop
- 🎴 **Profile Card** — Complete member profile with XP bar and badges
- 📊 **Statistics** — Full stats per member and server
- 🎁 **Loot Box** — Common, Rare, and Legendary boxes with random rewards
- 🎣 **Fishing System** — Catch fish with 5 rarities (Common to Legendary)
- 🏪 **Shop System** — Buy fishing rods, bait, boosts, and exclusive badges
- 🎒 **Inventory** — View all items, fish, loot boxes, and badges in one place
- 🎣 **Equip System** — Switch fishing rods and bait to boost rare fish chances
- ⚡ **Boost System** — XP Boost 2x, Coin Boost 2x, Lucky Charm (1 hour)
- 🎉 **Event System** — Double XP, Double Coins, Fishing Frenzy, Loot Rain
- 🔥 **Roast Me** — Roast a member with Indonesian-style sarcasm
- 📋 **Help Command** — List of all commands by category

### 🌐 Web Dashboard
- 👥 Member Leaderboard with XP & coin editing
- 📢 Send announcements to a Discord channel
- 🎁 Give a loot box to a specific member
- 🔄 Reset all data for a member
- 🎉 Start/stop events from the dashboard

### 🗄️ Database
- `levels` table — XP, level, coins, bank, equip
- `tickets` table — Ticket system
- `badges` table — Member badges
- `game_stats` table — Game statistics
- `fish_inventory` table — Owned fish
- `lootboxes` table — Loot box inventory
- `shop_inventory` table — Owned shop items
- `active_boosts` table — Currently active boosts
- `events` table — Event system

---

## [Upcoming]

### ⏳ Planned Features
- ⚔️ RPG/Adventure System
- 🎰 Gacha System
- 🐾 Pet System

---

*Built by **Hanz** from **NEXALAB***