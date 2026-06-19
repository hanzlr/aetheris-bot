# 📋 Changelog

Semua perubahan penting pada project UMB Esport Bot akan didokumentasikan di sini.

---

## [v1.0.0] - 2026

### 🎉 Initial Release

#### ✨ Fitur Baru
- 🎫 **Ticket System** — Sistem open ticket dengan kategori dan tombol close
- ⭐ **Leveling & XP** — Sistem level otomatis dari aktivitas chat dengan cooldown 1 menit
- 💰 **Economy System** — Daily reward (100-250 koin), wallet, dan cek balance
- 🏦 **Bank System** — Deposit, withdraw, dan bunga 2% otomatis setiap Senin
- 🎮 **Mini Games** — Dice, Coinflip, Slot Machine, dan Blackjack interaktif
- 🏅 **Badge System** — Badge otomatis dari aktivitas dan badge eksklusif dari shop
- 🎴 **Profile Card** — Profil lengkap member dengan XP bar dan badge
- 📊 **Statistik** — Statistik lengkap per member dan server
- 🎁 **Loot Box** — Common, Rare, dan Legendary box dengan reward random
- 🎣 **Fishing System** — Mancing ikan dengan 5 rarity (Common hingga Legendary)
- 🏪 **Shop System** — Beli pancing, umpan, boost, dan badge eksklusif
- 🎒 **Inventory** — Lihat semua item, ikan, loot box, dan badge dalam satu tempat
- 🎣 **Equip System** — Ganti pancing dan umpan untuk boost chance ikan rare
- ⚡ **Boost System** — XP Boost 2x, Coin Boost 2x, Lucky Charm (1 jam)
- 🎉 **Event System** — Double XP, Double Coins, Fishing Frenzy, Loot Rain
- 🔥 **Roast Me** — Roast member dengan sarkas berbahasa Indonesia
- 📋 **Help Command** — Daftar semua command per kategori

#### 🌐 Web Dashboard
- 👥 Member Leaderboard dengan fitur edit XP & koin
- 📢 Kirim announcement ke channel Discord
- 🎁 Give loot box ke member tertentu
- 🔄 Reset semua data member
- 🎉 Start/stop event dari dashboard

#### 🗄️ Database
- Tabel `levels` — XP, level, koin, bank, equip
- Tabel `tickets` — Sistem ticket
- Tabel `badges` — Badge member
- Tabel `game_stats` — Statistik games
- Tabel `fish_inventory` — Ikan yang dimiliki
- Tabel `lootboxes` — Loot box inventory
- Tabel `shop_inventory` — Item shop yang dimiliki
- Tabel `active_boosts` — Boost yang sedang aktif
- Tabel `events` — Event system

---

## [v1.1.0] - 2026

### ✨ Fitur Baru
- ⭐ **Premium System** — Redeem key via `/premium redeem`, status via `/premium status`
- 💸 **Gift** — Transfer koin antar member (Premium only)
- 📊 **Transaction History** — Riwayat transaksi koin via `/history` (Premium only)
- 🚀 **Game Crash** — Mini game multiplier dengan cashout interaktif (Premium only)
- 🔔 **Premium Expiry Notification** — DM otomatis H-1 sebelum premium habis
- 🎁 **Weekly Premium Loot Box** — Rare box otomatis setiap Senin untuk member premium

### 🌐 Web Dashboard
- 🔑 Generate & hapus premium key
- 🔍 Search/filter member di leaderboard

### 🛡️ Improvement
- Rate limiting API (30 request/menit per IP)
- Cap multiplier XP & koin maksimal 3x (mencegah stacking event + boost + premium)
- Transaction logging lengkap di semua sumber koin (daily, games, fishing)

### 🗄️ Database
- Tabel `premium_keys` — Premium redeem keys
- Tabel `transactions` — Riwayat transaksi koin
- Kolom `is_premium` & `premium_expires_at` di tabel `levels`

---

## [Upcoming]

### ⏳ Fitur Yang Direncanakan
- ⚔️ RPG/Adventure System
- 🎰 Gacha System
- 🐾 Pet System

---

*Dibuat oleh **Hanz** dari **NEXALAB** untuk UMB Esport*
