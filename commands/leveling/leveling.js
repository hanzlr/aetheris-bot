import supabase from '../../database/supabase.js'
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'

const xpCooldown = new Map()

// Cek event aktif
async function getActiveEvent() {
  try {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .gte('ends_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    return data
  } catch {
    return null
  }
}

export async function handleXP(message) {
  if (message.author.bot) return
  if (message.channel.type === 1) return

  const userId = message.author.id
  const username = message.author.username
  const now = Date.now()
  const lastXP = xpCooldown.get(userId) || 0

  if (now - lastXP < 60 * 1000) return
  xpCooldown.set(userId, now)

  // Cek event double XP
  const event = await getActiveEvent()
  let xpGain = Math.floor(Math.random() * 11) + 15
  if (event?.event_type === 'double_xp') xpGain *= event.multiplier || 2

  const { data } = await supabase
    .from('levels')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!data) {
    await supabase.from('levels').insert({
      user_id: userId,
      username,
      xp: xpGain,
      level: 0,
      total_messages: 1,
    })
    return
  }

  const newXP = data.xp + xpGain
  const newMessages = data.total_messages + 1
  let newLevel = data.level

  const xpNeeded = 5 * ((newLevel + 1) ** 2) + 50 * (newLevel + 1) + 100
  let leveledUp = false

  if (newXP >= xpNeeded) {
    newLevel++
    leveledUp = true
  }

  await supabase
    .from('levels')
    .update({ xp: newXP, level: newLevel, total_messages: newMessages, username })
    .eq('user_id', userId)

  if (leveledUp) {
    message.channel.send(
      `🎉 Selamat **${username}**! Kamu naik ke **Level ${newLevel}**!`
    )
  }
}

export const levelData = new SlashCommandBuilder()
  .setName('level')
  .setDescription('Sistem leveling')
  .addSubcommand(sub =>
    sub.setName('rank')
      .setDescription('Lihat rank kamu')
  )
  .addSubcommand(sub =>
    sub.setName('leaderboard')
      .setDescription('Lihat leaderboard server')
  )

export async function handleLevel(interaction) {
  const sub = interaction.options.getSubcommand()

  if (sub === 'rank') {
    const user = interaction.user

    const { data } = await supabase
      .from('levels')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!data) return interaction.reply({ content: '❌ Kamu belum punya akun!', flags: 64 })

    const xpNeeded = 5 * ((data.level + 1) ** 2) + 50 * (data.level + 1) + 100
    const percent = Math.min(Math.floor((data.xp / xpNeeded) * 100), 100)
    const filled = Math.floor(percent / 10)
    const bar = `[${'█'.repeat(filled)}${'░'.repeat(10 - filled)}] ${percent}%`

    const event = await getActiveEvent()
    const eventText = event?.event_type === 'double_xp' ? '\n⚡ **Double XP Event Aktif!**' : ''

    const embed = new EmbedBuilder()
      .setTitle(`⭐ Rank ${user.username}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: '⭐ Level', value: `${data.level}`, inline: true },
        { name: '✨ XP', value: `${data.xp} / ${xpNeeded}`, inline: true },
        { name: '💬 Total Pesan', value: `${data.total_messages}`, inline: true },
        { name: '📊 Progress', value: bar + eventText, inline: false },
      )
      .setColor(0x5865F2)
      .setTimestamp()

    return interaction.reply({ embeds: [embed] })
  }

  if (sub === 'leaderboard') {
    const { data } = await supabase
      .from('levels')
      .select('*')
      .order('xp', { ascending: false })
      .limit(10)

    if (!data || data.length === 0) return interaction.reply({ content: '❌ Belum ada data!', flags: 64 })

    const list = data.map((m, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`
      return `${medal} **${m.username}** — Level ${m.level} (${m.xp} XP)`
    }).join('\n')

    const embed = new EmbedBuilder()
      .setTitle('🏆 Leaderboard UMB Esport')
      .setDescription(list)
      .setColor(0xFFD700)
      .setTimestamp()

    return interaction.reply({ embeds: [embed] })
  }
}