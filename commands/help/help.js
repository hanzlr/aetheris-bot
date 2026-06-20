import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const helpData = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Lihat semua command yang tersedia")
  .addStringOption((option) =>
    option
      .setName("kategori")
      .setDescription("Filter berdasarkan kategori")
      .setRequired(false)
      .addChoices(
        { name: "🎫 Ticket", value: "ticket" },
        { name: "⭐ Leveling", value: "leveling" },
        { name: "💰 Ekonomi", value: "ekonomi" },
        { name: "🎮 Games", value: "games" },
        { name: "🎣 Fishing", value: "fishing" },
        { name: "🚀 Equip", value: "equip" },
        { name: "🎉 Event", value: "event" },
        { name: "🏪 Shop & Equip", value: "shop" },
        { name: "🎒 Inventory & Profil", value: "profil" },
        { name: "🔥 Roast", value: "roast" },
        { name: "⚡ Boost", value: "boost" },
        { name: "⭐ Premium", value: "premium" },
      ),
  );

export async function handleHelp(interaction) {
  const kategori = interaction.options.getString("kategori");

  // ============================================================
  // SEMUA COMMAND
  // Kalau mau tambah command baru, tambahkan di kategori yang sesuai
  // ============================================================
  const allCategories = {
    ticket: {
      label: "🎫 Ticket",
      commands: [{ name: "/ticket", desc: "Buat panel ticket di channel" }],
    },
    leveling: {
      label: "⭐ Leveling",
      commands: [
        { name: "/level rank", desc: "Lihat rank & XP kamu" },
        { name: "/level leaderboard", desc: "Lihat leaderboard server" },
      ],
    },
    ekonomi: {
      label: "💰 Ekonomi",
      commands: [
        { name: "/economy daily", desc: "Claim koin harian" },
        { name: "/economy balance", desc: "Cek saldo wallet & bank" },
        { name: "/bank deposit [jumlah]", desc: "Simpan koin ke bank" },
        { name: "/bank withdraw [jumlah]", desc: "Ambil koin dari bank" },
      ],
    },
    games: {
      label: "🎮 Games",
      commands: [
        { name: "/game dice [taruhan]", desc: "Adu dadu lawan bot" },
        {
          name: "/game coinflip [pilihan] [taruhan]",
          desc: "Tebak koin heads/tails",
        },
        { name: "/game slot [taruhan]", desc: "Spin slot machine" },
        { name: "/game blackjack [taruhan]", desc: "Main blackjack lawan bot" },
      ],
    },
    fishing: {
      label: "🎣 Fishing",
      commands: [
        { name: "/fish cast", desc: "Mancing ikan (cooldown 30 detik)" },
        { name: "/fish sell", desc: "Jual semua ikan ke koin" },
        { name: "/fish sell [ikan]", desc: "Jual ikan tertentu" },
      ],
    },
    equip: {
      label: "🎣 Equip",
      commands: [
        { name: "/equip pancing [item]", desc: "Ganti pancing yang dipakai" },
        { name: "/equip umpan [item]", desc: "Ganti umpan yang dipakai" },
        { name: "/equip info", desc: "Lihat pancing & umpan aktif" },
      ],
    },
    event: {
      label: "🎉 Event",
      commands: [
        { name: "/event info", desc: "Lihat event yang sedang berlangsung" },
      ],
    },
    shop: {
      label: "🏪 Shop & Equip",
      commands: [
        { name: "/shop view", desc: "Lihat semua item di shop" },
        {
          name: "/shop view [kategori]",
          desc: "Filter item berdasarkan kategori",
        },
        { name: "/shop buy [item]", desc: "Beli item dari shop" },
        {
          name: "/lootbox buy [type]",
          desc: "Beli loot box (common/rare/legendary)",
        },
        { name: "/lootbox open [type]", desc: "Buka loot box" },
      ],
    },
    roast: {
      label: "🔥 Roast",
      commands: [
        { name: "/roast", desc: "Roast diri sendiri" },
        { name: "/roast @user", desc: "Roast member lain" },
      ],
    },

    profil: {
      label: "🎒 Inventory & Profil",
      commands: [
        { name: "/inventory", desc: "Lihat semua item yang kamu punya" },
        { name: "/inventory @user", desc: "Lihat inventory member lain" },
        { name: "/profile view", desc: "Lihat profil kamu" },
        { name: "/profile view @user", desc: "Lihat profil member lain" },
        { name: "/profile badges", desc: "Lihat semua badge kamu" },
        { name: "/stats view", desc: "Lihat statistik kamu" },
        { name: "/stats view @user", desc: "Lihat statistik member lain" },
        { name: "/stats server", desc: "Lihat statistik server" },
      ],
    },
    boost: {
      label: "⚡ Boost",
      commands: [
        { name: "/boost use [item]", desc: "Aktifkan boost dari inventory" },
        { name: "/boost info", desc: "Lihat boost yang sedang aktif" },
      ],
    },
    premium: {
      label: "⭐ Premium",
      commands: [
        { name: "/premium redeem [key]", desc: "Redeem premium key" },
        { name: "/premium status", desc: "Lihat status premium kamu" },
        {
          name: "/gift @user [jumlah]",
          desc: "Transfer koin ke member lain (Premium)",
        },
        { name: "/history", desc: "Lihat riwayat transaksi (Premium)" },
        {
          name: "/game crash [taruhan]",
          desc: "Game Crash multiplier (Premium)",
        },
      ],
    },
  };

  if (kategori) {
    // Tampilkan satu kategori
    const cat = allCategories[kategori];
    const commandList = cat.commands
      .map((c) => `\`${c.name}\`\n↳ ${c.desc}`)
      .join("\n\n");

    const embed = new EmbedBuilder()
      .setTitle(`${cat.label} — Command List`)
      .setDescription(commandList)
      .setColor(0x5865f2)
      .setFooter({ text: "Aetheris Bot • /help untuk semua kategori" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }

  // Tampilkan semua kategori
  const embed = new EmbedBuilder()
    .setTitle("📋 Aetheris Bot — Command List")
    .setDescription(
      "Gunakan `/help [kategori]` untuk detail command per kategori!",
    )
    .setColor(0x5865f2)
    .setTimestamp();

  for (const [, cat] of Object.entries(allCategories)) {
    const commandList = cat.commands
      .map((c) => `\`${c.name}\` — ${c.desc}`)
      .join("\n");

    embed.addFields({
      name: cat.label,
      value: commandList,
      inline: false,
    });
  }

  embed.setFooter({
    text: "Aetheris Bot • Ketik /help [kategori] untuk detail!",
  });

  return interaction.reply({ embeds: [embed] });
}
