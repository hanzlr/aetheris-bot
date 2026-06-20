import express from "express";
import cors from "cors";
import supabase from "./database/supabase.js";
import rateLimit from "express-rate-limit";

const app = express();
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 30, // maksimal 30 request per menit per IP
  message: { error: "Terlalu banyak request, coba lagi nanti." },
});
app.use(limiter);

const SECRET_KEY = process.env.API_SECRET || "umb-esport-secret-key";

function authMiddleware(req, res, next) {
  const key = req.headers["x-api-key"];
  if (key !== SECRET_KEY)
    return res.status(401).json({ error: "Unauthorized" });
  next();
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Aetheris Bot API is running!" });
});

app.get("/channels", authMiddleware, async (req, res) => {
  try {
    const guild = req.app.get("guild");
    const channels = guild.channels.cache
      .filter((c) => c.type === 0)
      .map((c) => ({ id: c.id, name: c.name }));
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/members", authMiddleware, async (req, res) => {
  try {
    const { data } = await supabase
      .from("levels")
      .select("user_id, username, level, coins, bank")
      .order("level", { ascending: false });
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/announce", authMiddleware, async (req, res) => {
  try {
    const { channelId, message, mention } = req.body;
    const guild = req.app.get("guild");
    const channel = guild.channels.cache.get(channelId);
    if (!channel)
      return res.status(404).json({ error: "Channel tidak ditemukan!" });
    let mentionText = "";
    if (mention === "everyone") mentionText = "@everyone\n";
    if (mention === "here") mentionText = "@here\n";
    await channel.send(
      `${mentionText}📢 **PENGUMUMAN**\n\n${message}\n\n— *Admin Aetheris*`,
    );
    res.json({ success: true, message: "Announcement berhasil dikirim!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/givebox", authMiddleware, async (req, res) => {
  try {
    const { userId, boxType } = req.body;
    await supabase
      .from("lootboxes")
      .insert({ user_id: userId, box_type: boxType });
    const guild = req.app.get("guild");
    const member = await guild.members.fetch(userId);
    await member.send(
      `🎁 Kamu mendapat **${boxType} box** dari Admin Aetheris! Buka dengan \`/lootbox open ${boxType}\``,
    );
    res.json({ success: true, message: `${boxType} box berhasil dikirim!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/resetuser", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    await supabase
      .from("levels")
      .update({
        xp: 0,
        level: 0,
        total_messages: 0,
        coins: 0,
        bank: 0,
        last_daily: null,
      })
      .eq("user_id", userId);
    await supabase.from("badges").delete().eq("user_id", userId);
    await supabase.from("lootboxes").delete().eq("user_id", userId);
    await supabase.from("fish_inventory").delete().eq("user_id", userId);
    await supabase.from("shop_inventory").delete().eq("user_id", userId);
    await supabase.from("game_stats").delete().eq("user_id", userId);
    res.json({ success: true, message: "Member berhasil direset!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ENDPOINT: Get active event
// ============================================================
app.get("/event", authMiddleware, async (req, res) => {
  try {
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .gte("ends_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    res.json(data || null);
  } catch {
    res.json(null);
  }
});

// ============================================================
// ENDPOINT: Start event
// ============================================================
app.post("/event/start", authMiddleware, async (req, res) => {
  try {
    const { eventType, multiplier, durationHours, channelId } = req.body;

    // Stop event yang sedang aktif dulu
    await supabase
      .from("events")
      .update({ is_active: false })
      .eq("is_active", true);

    const endsAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

    // Insert event baru
    await supabase.from("events").insert({
      event_type: eventType,
      multiplier: multiplier || 1,
      ends_at: endsAt.toISOString(),
      is_active: true,
    });

    // Kirim announcement ke channel
    if (channelId) {
      const guild = req.app.get("guild");
      const channel = guild.channels.cache.get(channelId);
      if (channel) {
        const eventLabels = {
          double_xp: "🎉 Double XP",
          double_coins: "💰 Double Coins",
          fishing_frenzy: "🎣 Fishing Frenzy",
          loot_rain: "🎁 Loot Rain",
        };
        await channel.send(
          `@everyone\n🎉 **EVENT DIMULAI!**\n\n` +
            `**${eventLabels[eventType]}** sekarang aktif!\n` +
            `⏰ Berakhir dalam **${durationHours} jam**\n\n` +
            `— *Admin Aetheris*`,
        );
      }
    }

    // Kalau loot rain, kasih loot box ke semua member
    if (eventType === "loot_rain") {
      const { data: allMembers } = await supabase
        .from("levels")
        .select("user_id");
      for (const member of allMembers || []) {
        await supabase
          .from("lootboxes")
          .insert({ user_id: member.user_id, box_type: "common" });
      }
    }

    res.json({ success: true, message: "Event berhasil dimulai!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ENDPOINT: Stop event
// ============================================================
app.post("/event/stop", authMiddleware, async (req, res) => {
  try {
    const { channelId } = req.body;

    await supabase
      .from("events")
      .update({ is_active: false })
      .eq("is_active", true);

    if (channelId) {
      const guild = req.app.get("guild");
      const channel = guild.channels.cache.get(channelId);
      if (channel) {
        await channel.send(
          `⚠️ **EVENT TELAH BERAKHIR!**\n\n— *Admin Aetheris*`,
        );
      }
    }

    res.json({ success: true, message: "Event berhasil dihentikan!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ============================================================
// ENDPOINT: Generate premium key
// ============================================================
app.post("/premium/generate", authMiddleware, async (req, res) => {
  try {
    const { duration } = req.body;

    // Generate random key
    const randomPart = () =>
      Math.random().toString(36).substring(2, 6).toUpperCase();
    // const key = `NEXALAB-${randomPart()}-${randomPart()}-${randomPart()}`;
    const key = `${randomPart()}-${randomPart()}-${randomPart()}-${randomPart()}`;

    await supabase
      .from("premium_keys")
      .insert({ key, duration, status: "unused" });

    res.json({ success: true, key });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ENDPOINT: Get all premium keys
// ============================================================
app.get("/premium/keys", authMiddleware, async (req, res) => {
  try {
    const { data } = await supabase
      .from("premium_keys")
      .select("*")
      .order("created_at", { ascending: false });
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/premium/delete", authMiddleware, async (req, res) => {
  try {
    const { key } = req.body;
    await supabase.from("premium_keys").delete().eq("key", key);
    res.json({ success: true, message: "Key berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export function startServer(client, port = 3000) {
  client.once("clientReady", () => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    app.set("guild", guild);
  });

  app.listen(port, () => {
    console.log(`✅ API Server jalan di port ${port}`);
  });
}
