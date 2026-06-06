import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import supabase from '../../database/supabase.js'

// Hitung XP yang dibutuhkan untuk naik level
export function xpForLevel(level) {
  return 5 * (level ** 2) + 50 * level + 100
}

// Handle XP dari ngobrol
export async function handleXP(message) {
  if (message.author.bot) return

  const userId = message.author.id
  const username = message.author.username

  // Ambil data user dari Supabase
  let { data: user } = await supabase
    .from('levels')
    .select('*')
    .eq('user_id', userId)
    .single()

  // Kalau user belum ada, buat baru
  if (!user) {
    const { data: newUser } = await supabase
      .from('levels')
      .insert({ user_id: userId, username, xp: 0, level: 0, total_messages: 0 })
      .select()
      .single()
    user = newUser
  }

  // Cooldown 1 menit
  const now = new Date()
  const lastXP = new Date(user.last_xp)
  const diff = (now - lastXP) / 1000 / 60

  if (diff < 1) return

  // Kasih XP random 15-25
  const xpGained = Math.floor(Math.random() * 11) + 15
  const newXP = user.xp + xpGained
  const newMessages = user.total_messages + 1

  // Cek apakah naik level
  let newLevel = user.level
  while (newXP >= xpForLevel(newLevel + 1)) {
    newLevel++
  }

  // Update ke Supabase
  await supabase
    .from('levels')
    .update({
      xp: newXP,
      level: newLevel,
      total_messages: newMessages,
      username,
      last_xp: now.toISOString()
    })
    .eq('user_id', userId)

  // Announce naik level
  if (newLevel > user.level) {
    const embed = new EmbedBuilder()
      .setTitle('🎉 Level Up!')
      .setDescription(`Selamat ${message.author}! Kamu naik ke **Level ${newLevel}!** 🚀`)
      .setColor(0xFFD700)
      .setTimestamp()

    message.channel.send({ embeds: [embed] })
  }
}

// Command /rank
export const rankData = new SlashCommandBuilder()
  .setName('rank')
  .setDescription('Lihat rank kamu')

export async function handleRank(interaction) {
  const user = interaction.user

  const { data } = await supabase
    .from('levels')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!data) {
    return interaction.reply({ content: '❌ Kamu belum punya XP! Mulai ngobrol dulu.', flags: 64 })
  }

  const xpNeeded = xpForLevel(data.level + 1)

  const embed = new EmbedBuilder()
    .setTitle(`📊 Rank ${user.username}`)
    .setThumbnail(user.displayAvatarURL())
    .addFields(
      { name: '⭐ Level', value: `${data.level}`, inline: true },
      { name: '✨ XP', value: `${data.xp} / ${xpNeeded}`, inline: true },
      { name: '💬 Total Pesan', value: `${data.total_messages}`, inline: true },
    )
    .setColor(0x5865F2)
    .setTimestamp()

  interaction.reply({ embeds: [embed] })
}

// Command /leaderboard
export const leaderboardData = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Lihat ranking server')

export async function handleLeaderboard(interaction) {
  const { data } = await supabase
    .from('levels')
    .select('*')
    .order('xp', { ascending: false })
    .limit(10)

  if (!data || data.length === 0) {
    return interaction.reply({ content: '❌ Belum ada data ranking!', flags: 64 })
  }

  const medals = ['🥇', '🥈', '🥉']

  const description = data.map((user, index) => {
    const medal = medals[index] || `**${index + 1}.**`
    return `${medal} **${user.username}** — Level ${user.level} (${user.xp} XP)`
  }).join('\n')

  const embed = new EmbedBuilder()
    .setTitle('🏆 Leaderboard UMB Esport')
    .setDescription(description)
    .setColor(0xFFD700)
    .setTimestamp()

  interaction.reply({ embeds: [embed] })
}