# 🎮 UMB Esport Bot

![Node.js](https://img.shields.io/badge/Node.js-v20-green)
![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Railway](https://img.shields.io/badge/Hosted-Railway-purple)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E)
![Vercel](https://img.shields.io/badge/Dashboard-Vercel-black)

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

### 🎫 Ticket
| Command | Fungsi |
|---|---|
| `/ticket` | Buat panel ticket |

### ⭐ Leveling & Ekonomi
| Command | Fungsi | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Command | Fungsi |
|---|---|---|---|---|
| `/level rank` | Lihat rank & XP | | `/economy daily` | Claim koin harian |
| `/level leaderboard` | Leaderboard server | | `/economy balance` | Cek saldo |
| `/bank deposit` | Simpan koin ke bank | | `/bank withdraw` | Ambil koin dari bank |

### 🎮 Games
| Command | Fungsi | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Command | Fungsi |
|---|---|---|---|---|
| `/game dice` | Main dadu | | `/game coinflip` | Main koin |
| `/game slot` | Main slot | | `/game blackjack` | Main blackjack |

### 🎣 Fishing & Equip
| Command | Fungsi | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Command | Fungsi |
|---|---|---|---|---|
| `/fish cast` | Mancing ikan | | `/fish sell` | Jual ikan |
| `/equip pancing` | Ganti pancing | | `/equip umpan` | Ganti umpan |
| `/equip info` | Lihat equip aktif | | | |

### 🏪 Shop & Inventory
| Command | Fungsi | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Command | Fungsi |
|---|---|---|---|---|
| `/shop view` | Lihat shop | | `/shop buy` | Beli item |
| `/lootbox buy` | Beli loot box | | `/lootbox open` | Buka loot box |
| `/boost use` | Aktifkan boost | | `/boost info` | Lihat boost aktif |
| `/inventory` | Lihat inventory | | | |

### 🎒 Profil & Statistik
| Command | Fungsi | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Command | Fungsi |
|---|---|---|---|---|
| `/profile view` | Lihat profil | | `/profile badges` | Lihat badge |
| `/stats view` | Lihat statistik | | `/stats server` | Statistik server |

### 🎉 Event & Lainnya
| Command | Fungsi | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Command | Fungsi |
|---|---|---|---|---|
| `/event info` | Lihat event aktif | | `/roast` | Roast member |
| `/help` | Daftar command | | | |

## 🔗 Links

- **Dashboard**: https://dashboardbot-nine.vercel.app
- **API**: https://umb-esport-bot-production-abed.up.railway.app

## 📋 Changelog

Lihat semua perubahan di [CHANGELOG.md](CHANGELOG.md)

## 👤 Developer

Dibuat oleh **hanzlr** dari **NEXALAB** untuk UMB Esport
