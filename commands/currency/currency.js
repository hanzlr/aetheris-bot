import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import supabase from "../../database/supabase.js";
import { isPremium } from "../premium/premium.js";

async function getActiveEvent() {
  try {
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .gte("ends_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    return data;
  } catch {
    return null;
  }
}

export const economyData = new SlashCommandBuilder()
  .setName("economy")
  .setDescription("Sistem ekonomi")
  .addSubcommand((sub) =>
    sub.setName("daily").setDescription("Claim koin harian kamu!"),
  )
  .addSubcommand((sub) =>
    sub.setName("balance").setDescription("Cek koin kamu"),
  );

export async function handleEconomy(interaction) {
  const sub = interaction.options.getSubcommand();
  const user = interaction.user;

  if (sub === "daily") {
    let { data } = await supabase
      .from("levels")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!data)
      return interaction.reply({
        content: "❌ Kamu belum punya akun! Mulai ngobrol dulu.",
        flags: 64,
      });

    const now = new Date();
    if (data.last_daily) {
      const lastDaily = new Date(data.last_daily);
      const diff = (now - lastDaily) / 1000 / 60 / 60;

      if (diff < 24) {
        const sisaJam = Math.floor(24 - diff);
        const sisaMenit = Math.floor((24 - diff - sisaJam) * 60);
        return interaction.reply({
          content: `⏳ Kamu sudah claim daily hari ini! Kembali lagi dalam **${sisaJam} jam ${sisaMenit} menit**.`,
          flags: 64,
        });
      }
    }

    // Cek event double coins
    const event = await getActiveEvent();
    let coinsGained = Math.floor(Math.random() * 151) + 100;
    let eventText = "";

    if (event?.event_type === "double_coins") {
      coinsGained *= event.multiplier || 2;
      eventText = `\n💰 **Double Coins Event Aktif! x${event.multiplier || 2}**`;
    }

    // Cek premium
    const userIsPremium = await isPremium(user.id);
    if (userIsPremium) {
      coinsGained = Math.floor(Math.random() * 201) + 300;
      eventText += "\n⭐ **Premium Bonus! Daily 2x lebih banyak**";
    }

    const newCoins = (data.coins || 0) + coinsGained;

    await supabase
      .from("levels")
      .update({ coins: newCoins, last_daily: now.toISOString() })
      .eq("user_id", user.id);

    const embed = new EmbedBuilder()
      .setTitle("🎁 Daily Reward!")
      .setDescription(`${user} berhasil claim daily reward!${eventText}`)
      .addFields(
        {
          name: "💰 Koin Didapat",
          value: `+${coinsGained} koin`,
          inline: true,
        },
        { name: "💳 Total Koin", value: `${newCoins} koin`, inline: true },
      )
      .setColor(0xffd700)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }

  if (sub === "balance") {
    const { data } = await supabase
      .from("levels")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!data)
      return interaction.reply({
        content: "❌ Kamu belum punya akun! Mulai ngobrol dulu.",
        flags: 64,
      });

    // Cek event aktif
    const event = await getActiveEvent();
    let eventText = "";
    if (event) {
      const labels = {
        double_xp: "🎉 Double XP",
        double_coins: "💰 Double Coins",
        fishing_frenzy: "🎣 Fishing Frenzy",
        loot_rain: "🎁 Loot Rain",
      };
      eventText = `\n⚡ Event aktif: **${labels[event.event_type]}**`;
    }

    const embed = new EmbedBuilder()
      .setTitle(`💰 Balance ${user.username}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "💳 Wallet", value: `${data.coins || 0} koin`, inline: true },
        { name: "🏦 Bank", value: `${data.bank || 0} koin`, inline: true },
        { name: "⭐ Level", value: `${data.level}`, inline: true },
      )
      .setColor(0xffd700)
      .setDescription(eventText || null)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
}
