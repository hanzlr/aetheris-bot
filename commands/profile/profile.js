import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import supabase from "../../database/supabase.js";
import { isPremium } from "../premium/premium.js";

// Daftar semua badge
export const BADGES = {
  chatterbox: { emoji: "💬", name: "Chatterbox", desc: "Kirim 100 pesan" },
  rising_star: { emoji: "⭐", name: "Rising Star", desc: "Capai Level 5" },
  legend: { emoji: "🔥", name: "Legend", desc: "Capai Level 20" },
  gambler: { emoji: "🎲", name: "Gambler", desc: "Main game 10 kali" },
  high_roller: { emoji: "🎰", name: "High Roller", desc: "Menang slot 5 kali" },
  rich: { emoji: "💰", name: "Rich", desc: "Punya 10.000 koin" },
  saver: { emoji: "🏦", name: "Saver", desc: "Simpan 5.000 koin di bank" },
  // Badge dari loot box
  lucky_common: {
    emoji: "🎁",
    name: "Lucky Common",
    desc: "Dapat dari Common Loot Box",
  },
  lucky_rare: {
    emoji: "💜",
    name: "Lucky Rare",
    desc: "Dapat dari Rare Loot Box",
  },
  lucky_legendary: {
    emoji: "🌟",
    name: "Lucky Legendary",
    desc: "Dapat dari Legendary Loot Box",
  },
  daily_streak: {
    emoji: "📅",
    name: "Consistent",
    desc: "Claim daily 7 hari berturut",
  },
  // Badge eksklusif shop
  diamond_member: {
    emoji: "💎",
    name: "Diamond Member",
    desc: "Badge eksklusif dari shop",
  },
  king_of_server: {
    emoji: "👑",
    name: "King of Server",
    desc: "Badge eksklusif dari shop",
  },
  elite_player: {
    emoji: "🔱",
    name: "Elite Player",
    desc: "Badge eksklusif dari shop",
  },
  rainbow_legend: {
    emoji: "🌈",
    name: "Rainbow Legend",
    desc: "Badge eksklusif dari shop",
  },
  thunder_god: {
    emoji: "⚡",
    name: "Thunder God",
    desc: "Badge eksklusif dari shop",
  },
};

// Cek dan kasih badge otomatis
export async function checkBadges(userId, userData) {
  const { data: existingBadges } = await supabase
    .from("badges")
    .select("badge_id")
    .eq("user_id", userId);

  const owned = existingBadges?.map((b) => b.badge_id) || [];
  const newBadges = [];

  // Cek setiap kondisi badge
  if (!owned.includes("chatterbox") && userData.total_messages >= 100)
    newBadges.push("chatterbox");
  if (!owned.includes("rising_star") && userData.level >= 5)
    newBadges.push("rising_star");
  if (!owned.includes("legend") && userData.level >= 20)
    newBadges.push("legend");
  if (!owned.includes("rich") && (userData.coins || 0) >= 10000)
    newBadges.push("rich");
  if (!owned.includes("saver") && (userData.bank || 0) >= 5000)
    newBadges.push("saver");

  // Insert badge baru
  if (newBadges.length > 0) {
    await supabase
      .from("badges")
      .insert(newBadges.map((badge_id) => ({ user_id: userId, badge_id })));
  }

  return newBadges;
}

// Subcommand /profile
export const profileData = new SlashCommandBuilder()
  .setName("profile")
  .setDescription("Sistem profil & badge")
  .addSubcommand((sub) =>
    sub
      .setName("view")
      .setDescription("Lihat profil kamu atau member lain")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("Member yang mau dilihat (opsional)")
          .setRequired(false),
      ),
  )
  .addSubcommand((sub) =>
    sub.setName("badges").setDescription("Lihat semua badge yang kamu punya"),
  );

export async function handleProfile(interaction) {
  const sub = interaction.options.getSubcommand();

  if (sub === "view") {
    const target = interaction.options.getUser("user") || interaction.user;

    const { data } = await supabase
      .from("levels")
      .select("*")
      .eq("user_id", target.id)
      .single();

    if (!data)
      return interaction.reply({
        content: "❌ User ini belum punya akun!",
        flags: 64,
      });

    // Cek badge baru
    const newBadges = await checkBadges(target.id, data);

    // Ambil semua badge user
    const { data: userBadges } = await supabase
      .from("badges")
      .select("badge_id")
      .eq("user_id", target.id);

    const badgeEmojis =
      userBadges?.map((b) => BADGES[b.badge_id]?.emoji || "🏅").join(" ") ||
      "Belum ada badge";

    const xpNeeded = 5 * (data.level + 1) ** 2 + 50 * (data.level + 1) + 100;
    const xpBar = buildXPBar(data.xp, xpNeeded);

    // Cek premium
    const userIsPremium = await isPremium(target.id);
    const premiumTag = userIsPremium ? " ⭐ [PREMIUM]" : "";

    const embed = new EmbedBuilder()
      .setTitle(`🎮 Profil ${target.username}${premiumTag}`)
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        { name: "⭐ Level", value: `${data.level}`, inline: true },
        { name: "✨ XP", value: `${data.xp} / ${xpNeeded}`, inline: true },
        { name: "💬 Pesan", value: `${data.total_messages}`, inline: true },
        { name: "📊 Progress", value: xpBar, inline: false },
        { name: "💳 Wallet", value: `${data.coins || 0} koin`, inline: true },
        { name: "🏦 Bank", value: `${data.bank || 0} koin`, inline: true },
        { name: "🏅 Badges", value: badgeEmojis, inline: false },
      )
      .setColor(0x5865f2)
      .setFooter({ text: `UMB Esport • Member sejak bergabung` })
      .setTimestamp();

    if (newBadges.length > 0) {
      const newBadgeText = newBadges
        .map((b) => `${BADGES[b].emoji} ${BADGES[b].name}`)
        .join(", ");
      embed.addFields({ name: "🎉 Badge Baru!", value: newBadgeText });
    }

    interaction.reply({ embeds: [embed] });
  }

  if (sub === "badges") {
    const user = interaction.user;

    const { data: userBadges } = await supabase
      .from("badges")
      .select("badge_id, earned_at")
      .eq("user_id", user.id);

    if (!userBadges || userBadges.length === 0) {
      return interaction.reply({
        content: "❌ Kamu belum punya badge! Terus aktif di server.",
        flags: 64,
      });
    }

    const badgeList = userBadges
      .map((b) => {
        const badge = BADGES[b.badge_id];
        const date = new Date(b.earned_at).toLocaleDateString("id-ID");
        return `${badge?.emoji} **${badge?.name}** — ${badge?.desc} *(${date})*`;
      })
      .join("\n");

    const embed = new EmbedBuilder()
      .setTitle(`🏅 Badge ${user.username}`)
      .setDescription(badgeList)
      .setColor(0xffd700)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
}

// XP progress bar
function buildXPBar(current, needed) {
  const percent = Math.min(current / needed, 1);
  const filled = Math.floor(percent * 10);
  const empty = 10 - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}] ${Math.floor(percent * 100)}%`;
}
