<p align="center">
     <img src="./assets/aetheris-banner.png" alt="Aetheris Bot Banner" width="100%">
</p>

# 🎮 Aetheris Bot

![Node.js](https://img.shields.io/badge/Node.js-v20-green)
![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Railway](https://img.shields.io/badge/Hosted-Railway-purple)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E)
![Vercel](https://img.shields.io/badge/Dashboard-Vercel-black)

The official Discord bot for the community. Built with Node.js and Discord.js v14.

## ✨ Features

- 🎫 **Ticket System** — Create and manage support tickets
- ⭐ **Leveling & XP** — Leveling system from chat activity
- 💰 **Economy** — Daily reward, wallet, and bank
- 🎮 **Mini Games** — Dice, Coinflip, Slot, Blackjack, Crash (Premium)
- 🎣 **Fishing** — Catch fish with various rarities
- 🏪 **Shop** — Buy items, fishing rods, bait, and exclusive badges
- 🎒 **Inventory** — View all owned items
- 🎁 **Loot Box** — Common, Rare, and Legendary boxes
- ⚡ **Boost System** — XP Boost, Coin Boost, Lucky Charm
- 🏅 **Badge System** — Badges from activity, shop, and premium
- 📊 **Statistics** — Full stats per member & server
- 🎮 **Profile Card** — Complete member profile
- 🔥 **Roast Me** — Roast a member with sarcasm
- 🎉 **Event System** — Double XP, Double Coins, Fishing Frenzy, Loot Rain
- ⭐ **Premium System** — Exclusive benefits via redeem key
- 💸 **Gift** — Transfer coins between members (Premium)
- 📊 **Transaction History** — Coin transaction history (Premium)
- 📋 **Help Command** — List of all commands

## 🛠️ Tech Stack

- **Runtime**: Node.js v20
- **Framework**: Discord.js v14
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Railway
- **Module**: ES Modules (`"type": "module"`)

## 📁 Folder Structure

```
aetheris-bot/
├── index.js                    # Entry point
├── server.js                   # Express API server
├── database/
│   └── supabase.js             # Supabase client
│   └── schema.sql              # Database schema
└── commands/
├── ticket/
├── leveling/
├── currency/
├── bank/
├── games/
├── profile/
├── stats/
├── lootbox/
├── inventory/
├── fishing/
├── shop/
├── equip/
├── boost/
├── help/
├── roast/
├── event/
├── premium/
├── gift/
└── history/
```

## ⚙️ Environment Variables

Create a `.env` file in the root folder:

```env
DISCORD_TOKEN=your_discord_bot_token
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GUILD_ID=your_discord_server_id
API_SECRET=your_api_secret_key
```

## 🗄️ Database Tables

| Table | Purpose |
|---|---|
| `levels` | XP, level, coins, bank, equip, premium |
| `tickets` | Ticket system |
| `badges` | Member badges |
| `game_stats` | Game statistics |
| `fish_inventory` | Owned fish |
| `lootboxes` | Loot box inventory |
| `shop_inventory` | Owned shop items |
| `active_boosts` | Currently active boosts |
| `events` | Event system |
| `premium_keys` | Premium redeem keys |
| `transactions` | Coin transaction history |

> 📄 Full schema: [`database/SCHEMA.md`](database/SCHEMA.md) (readable) · [`database/schema.sql`](database/schema.sql) (raw SQL)

## 🚀 Setup

1. Clone the repository
```bash
git clone https://github.com/hanzlr/aetheris-bot.git
cd aetheris-bot
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file and fill in the environment variables

4. Run the bot
```bash
node index.js
```

## 📋 Slash Commands

### 🎫 Ticket
| Command | Purpose |
|---|---|
| `/ticket` | Create a ticket panel |

### ⭐ Leveling & Economy
| Command | Purpose | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Command | Purpose |
|---|---|---|---|---|
| `/level rank` | View your rank & XP | | `/economy daily` | Claim daily coins |
| `/level leaderboard` | Server leaderboard | | `/economy balance` | Check your balance |
| `/bank deposit` | Deposit coins to bank | | `/bank withdraw` | Withdraw coins from bank |

### 🎮 Games
| Command | Purpose | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Command | Purpose |
|---|---|---|---|---|
| `/game dice` | Play dice | | `/game coinflip` | Play coinflip |
| `/game slot` | Play slot | | `/game blackjack` | Play blackjack |

### 🎣 Fishing & Equip
| Command | Purpose | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Command | Purpose |
|---|---|---|---|---|
| `/fish cast` | Cast a fishing line | | `/fish sell` | Sell fish |
| `/equip pancing` | Change fishing rod | | `/equip umpan` | Change bait |
| `/equip info` | View active equipment | | | |

### 🏪 Shop & Inventory
| Command | Purpose | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Command | Purpose |
|---|---|---|---|---|
| `/shop view` | View shop | | `/shop buy` | Buy an item |
| `/lootbox buy` | Buy a loot box | | `/lootbox open` | Open a loot box |
| `/boost use` | Activate a boost | | `/boost info` | View active boosts |
| `/inventory` | View inventory | | | |

### 🎒 Profile & Statistics
| Command | Purpose | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Command | Purpose |
|---|---|---|---|---|
| `/profile view` | View profile | | `/profile badges` | View badges |
| `/stats view` | View statistics | | `/stats server` | Server statistics |

### 🎉 Event & Others
| Command | Purpose | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Command | Purpose |
|---|---|---|---|---|
| `/event info` | View active event | | `/roast` | Roast a member |
| `/help` | List of commands | | | |

### ⭐ Premium
| Command | Purpose | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Command | Purpose |
|---|---|---|---|---|
| `/premium redeem` | Redeem a premium key | | `/premium status` | Check premium status |
| `/gift` | Transfer coins to a member | | `/history` | Transaction history |
| `/game crash` | Crash multiplier game | | | |

## 🔗 Links

- **Dashboard**: https://dashboardbot-nine.vercel.app
- **API**: https://aetheris-bot-production.up.railway.app
- **Landing Page**: https://aetheris.nexalab.my.id

## 📋 Changelog

See all changes in [CHANGELOG.md](CHANGELOG.md)

## 👤 Developer

Built by **hanzlr** from **NEXALAB**