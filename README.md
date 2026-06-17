# 🎮 UMB Esport Bot

Bot Discord resmi untuk komunitas UMB Esport. Dibangun dengan Node.js dan Discord.js v14.

## ✨ Fitur

- 🎫 **Ticket System** — Buat dan kelola ticket support
- ⭐ **Leveling & XP** — Sistem level dari aktivitas chat
- 💰 **Ekonomi** — Daily reward, wallet, dan bank
- 🎮 **Mini Games** — Dice, Coinflip, Slot, Blackjack
- 🎣 **Fishing** — Mancing ikan dengan berbagai rarity
- 🏪 **Shop** — Beli item, pancing, umpan, dan badge eksklusif
- 🎒 **Inventory** — Lihat semua item yang dimiliki
- 🎁 **Loot Box** — Common, Rare, dan Legendary box
- ⚡ **Boost System** — XP Boost, Coin Boost, Lucky Charm
- 🏅 **Badge System** — Badge dari aktivitas dan shop
- 📊 **Statistik** — Statistik lengkap per member & server
- 🎮 **Profile Card** — Profil lengkap member
- 🔥 **Roast Me** — Roast member dengan sarkas
- 🎉 **Event System** — Double XP, Double Coins, Fishing Frenzy, Loot Rain
- 📋 **Help Command** — Daftar semua command

## 🛠️ Tech Stack

- **Runtime**: Node.js v20
- **Framework**: Discord.js v14
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Railway
- **Module**: ES Modules (`"type": "module"`)

## 📁 Struktur Folder
```
umb-esport-bot/
├── index.js                    # Entry point
├── server.js                   # Express API server
├── database/
│   └── supabase.js             # Supabase client
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
    └── event/
```

## ⚙️ Environment Variables

Buat file `.env` di root folder:

```env
DISCORD_TOKEN=your_discord_bot_token
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GUILD_ID=your_discord_server_id
API_SECRET=your_api_secret_key
```

## 🗄️ Database Tables

| Tabel | Fungsi |
|---|---|
| `levels` | XP, level, koin, bank, equip |
| `tickets` | Sistem ticket |
| `badges` | Badge member |
| `game_stats` | Statistik games |
| `fish_inventory` | Ikan yang dimiliki |
| `lootboxes` | Loot box inventory |
| `shop_inventory` | Item shop yang dimiliki |
| `active_boosts` | Boost yang sedang aktif |
| `events` | Event system |

## 🚀 Cara Setup

1. Clone repository
```bash
git clone https://github.com/hanzlr/umb-esport-bot.git
cd umb-esport-bot
```

2. Install dependencies
```bash
npm install
```

3. Buat file `.env` dan isi dengan environment variables

4. Jalankan bot
```bash
node index.js
```

## 📋 Slash Commands

| Command | Fungsi |
|---|---|
| `/ticket` | Buat panel ticket |
| `/level rank` | Lihat rank & XP |
| `/level leaderboard` | Leaderboard server |
| `/economy daily` | Claim koin harian |
| `/economy balance` | Cek saldo |
| `/bank deposit` | Simpan koin ke bank |
| `/bank withdraw` | Ambil koin dari bank |
| `/game dice` | Main dadu |
| `/game coinflip` | Main koin |
| `/game slot` | Main slot |
| `/game blackjack` | Main blackjack |
| `/fish cast` | Mancing ikan |
| `/fish sell` | Jual ikan |
| `/shop view` | Lihat shop |
| `/shop buy` | Beli item |
| `/equip pancing` | Ganti pancing |
| `/equip umpan` | Ganti umpan |
| `/lootbox buy` | Beli loot box |
| `/lootbox open` | Buka loot box |
| `/boost use` | Aktifkan boost |
| `/boost info` | Lihat boost aktif |
| `/profile view` | Lihat profil |
| `/profile badges` | Lihat badge |
| `/stats view` | Lihat statistik |
| `/stats server` | Statistik server |
| `/inventory` | Lihat inventory |
| `/event info` | Lihat event aktif |
| `/roast` | Roast member |
| `/help` | Daftar command |

## 🔗 Links

- **Dashboard**: https://dashboardbot-nine.vercel.app
- **API**: https://umb-esport-bot-production-abed.up.railway.app

## 📋 Changelog

Lihat semua perubahan di [CHANGELOG.md](CHANGELOG.md)

## 👤 Developer

Dibuat oleh **hanzlr** dari **NEXALAB** untuk UMB Esport
