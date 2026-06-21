# 🗄️ Database Schema

Full database structure for Aetheris Bot. Database: **Supabase (PostgreSQL)**.

> 📄 Raw SQL available in [`database/schema.sql`](schema.sql)

---

## 🎫 tickets
Stores support ticket data.

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | SERIAL | — | Primary key |
| `ticket_id` | TEXT | — | Required |
| `user_id` | TEXT | — | Required |
| `username` | TEXT | — | Required |
| `category` | TEXT | — | Required |
| `status` | TEXT | `'open'` | |
| `channel_id` | TEXT | — | |
| `created_at` | TIMESTAMP | `NOW()` | |

---

## ⭐ levels
Core member data: XP, level, coins, bank, equip, premium.

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | SERIAL | — | Primary key |
| `user_id` | TEXT | — | Unique, required |
| `username` | TEXT | — | Required |
| `xp` | INTEGER | `0` | |
| `level` | INTEGER | `0` | |
| `coins` | INTEGER | `0` | |
| `bank` | INTEGER | `0` | |
| `total_messages` | INTEGER | `0` | |
| `last_xp` | TIMESTAMP | `NOW()` | |
| `last_daily` | TIMESTAMP | — | |
| `equipped_pancing` | TEXT | `'pancing_bambu'` | |
| `equipped_umpan` | TEXT | `'cacing'` | |
| `is_premium` | BOOLEAN | `FALSE` | |
| `premium_expires_at` | TIMESTAMP | — | |

🔒 RLS: enabled — authenticated users can `SELECT`, `INSERT`, `UPDATE`.

---

## 🏅 badges
Badges owned by a member.

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | SERIAL | — | Primary key |
| `user_id` | TEXT | — | Required |
| `badge_id` | TEXT | — | Required |
| `earned_at` | TIMESTAMP | `NOW()` | |

Unique constraint: `(user_id, badge_id)`

🔒 RLS: enabled — authenticated users can `SELECT`, `INSERT`.

---

## 🎮 game_stats
History of mini game results (dice, coinflip, slot, blackjack, crash).

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | SERIAL | — | Primary key |
| `user_id` | TEXT | — | Required |
| `game_type` | TEXT | — | Required |
| `result` | TEXT | — | Required |
| `coins_change` | INTEGER | `0` | |
| `played_at` | TIMESTAMP | `NOW()` | |

🔒 RLS: enabled — authenticated users can `SELECT`, `INSERT`.

---

## 🎁 lootboxes
Loot box inventory owned by a member (common, rare, legendary).

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | SERIAL | — | Primary key |
| `user_id` | TEXT | — | Required |
| `box_type` | TEXT | — | Required |
| `opened` | BOOLEAN | `FALSE` | |
| `created_at` | TIMESTAMP | `NOW()` | |

🔒 RLS: enabled — authenticated users can `SELECT`, `INSERT`, `UPDATE`.

---

## 🎣 fish_inventory
Fish owned by a member from fishing.

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | SERIAL | — | Primary key |
| `user_id` | TEXT | — | Required |
| `fish_id` | TEXT | — | Required |
| `quantity` | INTEGER | `1` | |
| `created_at` | TIMESTAMP | `NOW()` | |

Unique constraint: `(user_id, fish_id)`

🔒 RLS: enabled — authenticated users can `SELECT`, `INSERT`, `UPDATE`.

---

## 🏪 shop_inventory
Items purchased by a member from the shop.

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | SERIAL | — | Primary key |
| `user_id` | TEXT | — | Required |
| `item_id` | TEXT | — | Required |
| `quantity` | INTEGER | `1` | |
| `purchased_at` | TIMESTAMP | `NOW()` | |

Unique constraint: `(user_id, item_id)`

🔒 RLS: enabled — authenticated users can `SELECT`, `INSERT`, `UPDATE`.

---

## 🎉 events
Server events: Double XP, Double Coins, Fishing Frenzy, Loot Rain.

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | SERIAL | — | Primary key |
| `event_type` | TEXT | — | Required |
| `multiplier` | FLOAT | `1` | |
| `ends_at` | TIMESTAMP | — | |
| `is_active` | BOOLEAN | `TRUE` | |
| `created_at` | TIMESTAMP | `NOW()` | |

🔒 RLS: enabled — authenticated users have full access (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).

---

## ⚡ active_boosts
Active boosts owned by a member: XP Boost, Coin Boost, Lucky Charm.

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | SERIAL | — | Primary key |
| `user_id` | TEXT | — | Required |
| `boost_type` | TEXT | — | Required |
| `expires_at` | TIMESTAMP | — | Required |
| `created_at` | TIMESTAMP | `NOW()` | |

🔒 RLS: enabled — authenticated users have full access.

---

## 🔑 premium_keys
Redeem keys for premium features.

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | SERIAL | — | Primary key |
| `key` | TEXT | — | Unique, required |
| `duration` | TEXT | — | `'1month'`, `'3month'`, or `'permanent'` |
| `status` | TEXT | `'unused'` | `'unused'` or `'used'` |
| `used_by` | TEXT | — | |
| `used_at` | TIMESTAMP | — | |
| `created_at` | TIMESTAMP | `NOW()` | |

🔒 RLS: enabled — authenticated users have full access.

---

## 📊 transactions
Coin transaction history (gift, daily, item purchase, etc).

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | SERIAL | — | Primary key |
| `user_id` | TEXT | — | Required |
| `type` | TEXT | — | Required |
| `amount` | INTEGER | — | Required |
| `description` | TEXT | — | |
| `created_at` | TIMESTAMP | `NOW()` | |

🔒 RLS: enabled — authenticated users have full access.

---

*Built by **Hanz** from **NEXALAB***