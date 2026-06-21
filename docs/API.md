# 🌐 API Documentation

Express API server used by the [Aetheris Dashboard](https://dashboardbot-nine.vercel.app) to communicate with the bot.

Base URL: `https://aetheris-bot-production.up.railway.app`

---

## 🔐 Authentication

All endpoints except `/health` require an API key sent via header:

```
x-api-key: <API_SECRET>
```

Requests without a valid key receive:
```json
{ "error": "Unauthorized" }
```
`401 Unauthorized`

## ⏱️ Rate Limiting

All endpoints are limited to **30 requests per minute per IP**. Exceeding this returns:
```json
{ "error": "Terlalu banyak request, coba lagi nanti." }
```

---

## Endpoints

### `GET /health`
Health check. No authentication required.

**Response**
```json
{ "status": "ok", "message": "Aetheris Bot API is running!" }
```

---

### `GET /channels`
Returns all text channels in the guild.

**Response**
```json
[
  { "id": "1234567890", "name": "general" },
  { "id": "1234567891", "name": "announcements" }
]
```

---

### `GET /members`
Returns all members from the `levels` table, sorted by level descending.

**Response**
```json
[
  { "user_id": "123", "username": "hanz", "level": 12, "coins": 4200, "bank": 1000 }
]
```

---

### `POST /announce`
Sends an announcement message to a specified channel.

**Body**
```json
{
  "channelId": "1234567890",
  "message": "Maintenance scheduled tonight at 10 PM.",
  "mention": "everyone"
}
```
`mention` accepts `"everyone"`, `"here"`, or omit for no mention.

**Response**
```json
{ "success": true, "message": "Announcement berhasil dikirim!" }
```

---

### `POST /givebox`
Gives a loot box to a specific member and DMs them a notification.

**Body**
```json
{ "userId": "123456789", "boxType": "rare" }
```

**Response**
```json
{ "success": true, "message": "rare box berhasil dikirim!" }
```

---

### `POST /resetuser`
Resets a member's XP, level, coins, bank, badges, loot boxes, fish inventory, shop inventory, and game stats.

**Body**
```json
{ "userId": "123456789" }
```

**Response**
```json
{ "success": true, "message": "Member berhasil direset!" }
```

> ⚠️ Destructive action — cannot be undone.

---

### `GET /event`
Returns the currently active event, or `null` if none.

**Response**
```json
{
  "id": 4,
  "event_type": "double_xp",
  "multiplier": 2,
  "ends_at": "2026-06-22T10:00:00.000Z",
  "is_active": true
}
```

---

### `POST /event/start`
Stops any currently active event, starts a new one, and (optionally) announces it in a channel.

**Body**
```json
{
  "eventType": "double_xp",
  "multiplier": 2,
  "durationHours": 3,
  "channelId": "1234567890"
}
```
Valid `eventType` values: `double_xp`, `double_coins`, `fishing_frenzy`, `loot_rain`.

> 💡 If `eventType` is `loot_rain`, every member in the `levels` table automatically receives a common loot box.

**Response**
```json
{ "success": true, "message": "Event berhasil dimulai!" }
```

---

### `POST /event/stop`
Stops the currently active event and (optionally) announces it in a channel.

**Body**
```json
{ "channelId": "1234567890" }
```

**Response**
```json
{ "success": true, "message": "Event berhasil dihentikan!" }
```

---

### `POST /premium/generate`
Generates a new premium redeem key.

**Body**
```json
{ "duration": "1month" }
```
Valid `duration` values: `1month`, `3month`, `permanent`.

**Response**
```json
{ "success": true, "key": "AETHERIS-X1F2-9K3L-AB12" }
```

---

### `GET /premium/keys`
Returns all premium keys, sorted by creation date descending.

**Response**
```json
[
  { "id": 1, "key": "AETHERIS-X1F2-9K3L-AB12", "duration": "1month", "status": "unused" }
]
```

---

### `POST /premium/delete`
Deletes a premium key.

**Body**
```json
{ "key": "AETHERIS-X1F2-9K3L-AB12" }
```

**Response**
```json
{ "success": true, "message": "Key berhasil dihapus!" }
```

---

## ⚠️ Error Format

All endpoints return errors in this shape with a `500` status (except `401 Unauthorized`):
```json
{ "error": "<error message>" }
```

---

*See [database/SCHEMA.md](../database/SCHEMA.md) for the underlying table structure.*