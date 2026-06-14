import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import supabase from '../../database/supabase.js'

// Command /daily
export const dailyData = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Claim koin harian kamu!')

export async function handleDaily(interaction) {
  const user = interaction.user

  // Ambil data user
  let { data } = await supabase
    .from('levels')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Kalau belum ada data
  if (!data) {
    return interaction.reply({
      content: '❌ Kamu belum punya akun! Mulai ngobrol dulu di server.',
      flags: 64
    })
  }

  // Cek cooldown 24 jam
  const now = new Date()
  if (data.last_daily) {
    const lastDaily = new Date(data.last_daily)
    const diff = (now - lastDaily) / 1000 / 60 / 60

    if (diff < 24) {
      const sisaJam = Math.floor(24 - diff)
      const sisaMenit = Math.floor((24 - diff - sisaJam) * 60)
      return interaction.reply({
        content: `⏳ Kamu sudah claim daily hari ini! Kembali lagi dalam **${sisaJam} jam ${sisaMenit} menit**.`,
        flags: 64
      })
    }
  }

  // Kasih koin random 100-250
  const coinsGained = Math.floor(Math.random() * 151) + 100
  const newCoins = (data.coins || 0) + coinsGained

  // Update ke Supabase
  await supabase
    .from('levels')
    .update({
      coins: newCoins,
      last_daily: now.toISOString()
    })
    .eq('user_id', user.id)

  const embed = new EmbedBuilder()
    .setTitle('🎁 Daily Reward!')
    .setDescription(`${user} berhasil claim daily reward!`)
    .addFields(
      { name: '💰 Koin Didapat', value: `+${coinsGained} koin`, inline: true },
      { name: '💳 Total Koin', value: `${newCoins} koin`, inline: true }
    )
    .setColor(0xFFD700)
    .setTimestamp()

  interaction.reply({ embeds: [embed] })
}

// Command /balance
export const balanceData = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('Cek koin kamu')

export async function handleBalance(interaction) {
  const user = interaction.user

  const { data } = await supabase
    .from('levels')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!data) {
    return interaction.reply({
      content: '❌ Kamu belum punya akun! Mulai ngobrol dulu di server.',
      flags: 64
    })
  }

  const embed = new EmbedBuilder()
    .setTitle(`💰 Balance ${user.username}`)
    .setThumbnail(user.displayAvatarURL())
    .addFields(
      { name: '💳 Koin', value: `${data.coins || 0} koin`, inline: true },
      { name: '⭐ Level', value: `${data.level}`, inline: true },
    )
    .setColor(0xFFD700)
    .setTimestamp()

  interaction.reply({ embeds: [embed] })
}