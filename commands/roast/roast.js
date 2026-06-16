import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'

// ============================================================
// DAFTAR ROAST
// Tambahkan roast baru di array yang sesuai kategorinya
// {target} akan diganti dengan mention user yang di-roast
// ============================================================

const ROASTS = [
  // Gaming & Skill
  `{target} skill-nya segitu doang? Bot pun malu nge-carry lo.`,
  `{target} main game kayak orang yang baru tau listrik ada.`,
  `{target} KDA-nya negatif, hidupnya kayaknya juga gitu.`,
  `{target} rank-nya lebih rendah dari ekspektasi orang tua-nya.`,
  `{target} udah uninstall game-nya aja, kasian storage-nya disiksa.`,
  `{target} katanya gamer, mouse-nya aja masih pake trackpad laptop.`,
  `{target} di game jadi beban, di kehidupan nyata juga sama.`,
  `{target} ping-nya 999, otaknya kayaknya juga sama.`,
  `{target} farm doang dari early sampai late game, tetep miskin juga.`,
  `{target} sudah di-report sama satu server karena dianggap bot tapi bot beneran aja lebih berguna.`,
  `{target} udah di-mute sama teamnya sendiri, padahal cuma ngomongin strategi yang salah terus.`,
  `{target} main ranked kayak lagi latihan, tapi latihannya juga gak pernah.`,
  `{target} bilang "gw carry nanti", tapi yang ke-carry malah musuh.`,
  `{target} hero pool-nya satu, winrate-nya nol.`,
  `{target} nonton tutorial YouTube 10 jam, tetep feeding juga.`,

  // Roast Umum
  `{target} hidupnya kayak wifi gratisan — lemot, sering disconnect, dan gak bisa diandalkan.`,
  `{target} otaknya kayak RAM 512MB — udah penuh duluan sebelum kerjaan selesai.`,
  `{target} kalau semangat lo setinggi bacot lo, mungkin lo udah sukses dari dulu.`,
  `{target} IQ-nya kayak suhu kulkas — dingin dan bikin yang di sekitarnya beku.`,
  `{target} satu-satunya hal yang konsisten dari lo adalah ketidak-konsistenan lo.`,
  `{target} potensi lo luar biasa — luar biasa tersembunyi.`,
  `{target} kalau kerja keras itu kunci sukses, lo kayaknya kehilangan kunci-nya.`,
  `{target} statistik lo di bot ini cerminan hidup lo — ngumpulin yang paling sedikit.`,
  `{target} bukan lo yang ketinggalan zaman, tapi zaman yang terlalu maju buat lo.`,
  `{target} lo itu spesial — dalam artian butuh penanganan khusus.`,

  // Roast Server & Sosial
  `{target} aktif di Discord tapi di kehidupan nyata mode AFK permanen.`,
  `{target} chat-nya panjang, kontribusinya pendek.`,
  `{target} tiap hari online tapi gak ada yang notice — NPC kehidupan nyata.`,
  `{target} followers Discord-nya lebih banyak dari teman aslinya.`,
  `{target} ngetik panjang-panjang, isinya receh semua.`,
  `{target} join voice channel langsung pada cabut — lo itu living mute button.`,
  `{target} kirim meme basi terus dikira lucu — selera humornya kayak microwave bekas.`,
  `{target} aktifnya cuma pas minta bantuan, giliran diminta balik — ghost mode aktif.`,

  // Roast Ekonomi Bot
  `{target} koin di bot ini aja susah dikumpulin, apalagi uang beneran.`,
  `{target} level-nya rendah, XP-nya dikit — ternyata di game pun lo males.`,
  `{target} kalah mulu di slot machine, tapi masih nyoba terus — definisi kegilaan.`,
  `{target} ikannya yang ke-catch cuma lele, padahal udah pake pancing legendary.`,
  `{target} bank-nya kosong, wallet-nya kosong — virtual aja bokek, gimana yang nyata.`,
]

export const roastData = new SlashCommandBuilder()
  .setName('roast')
  .setDescription('Roast seseorang dengan kejam!')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('Member yang mau di-roast (kosongkan untuk roast diri sendiri)')
      .setRequired(false)
  )

export async function handleRoast(interaction) {
  const target = interaction.options.getUser('user') || interaction.user
  const isSelf = target.id === interaction.user.id

  // Pilih roast random
  const roastTemplate = ROASTS[Math.floor(Math.random() * ROASTS.length)]
  const roastText = roastTemplate.replace('{target}', `<@${target.id}>`)

  const embed = new EmbedBuilder()
    .setTitle(isSelf ? '🔥 Auto Roast!' : '🔥 Roasted!')
    .setDescription(roastText)
    .setThumbnail(target.displayAvatarURL())
    .setColor(0xFF4500)
    .setFooter({
      text: isSelf
        ? `${interaction.user.username} memilih untuk di-roast sendiri 💀`
        : `Requested by ${interaction.user.username} • Semua roast hanya untuk hiburan!`
    })
    .setTimestamp()

  interaction.reply({ embeds: [embed] })
}