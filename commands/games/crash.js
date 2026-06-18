import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import supabase from '../../database/supabase.js'
import { isPremium } from '../premium/premium.js'
import { logTransaction } from '../history/history.js'

const activeGames = new Map()

function generateMultiplier(current) {
  // Makin tinggi multiplier, makin besar chance crash
  const crashChance = Math.min(0.1 + (current - 1) * 0.08, 0.95)
  const crashed = Math.random() < crashChance
  if (crashed) return null
  const increase = Math.random() * 0.5 + 0.1
  return Math.round((current + increase) * 100) / 100
}

function buildGraph(history) {
  const max = Math.max(...history)
  const height = 5
  let graph = ''
  for (let row = height; row >= 1; row--) {
    const threshold = (row / height) * max
    graph += history.map(v => v >= threshold ? '▓' : '░').join('') + '\n'
  }
  return graph
}

export async function handleCrash(interaction) {
  const user = interaction.user

  // Cek premium
  const userIsPremium = await isPremium(user.id)
  if (!userIsPremium) {
    return interaction.reply({
      content: '❌ Fitur ini khusus untuk member **⭐ PREMIUM**! Hubungi admin untuk mendapatkan key.',
      flags: 64
    })
  }

  const taruhan = interaction.options.getInteger('taruhan')

  if (taruhan <= 0) return interaction.reply({ content: '❌ Taruhan harus lebih dari 0!', flags: 64 })

  // Ambil data user
  const { data: userData } = await supabase
    .from('levels')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!userData) return interaction.reply({ content: '❌ Kamu belum punya akun!', flags: 64 })
  if ((userData.coins || 0) < taruhan) {
    return interaction.reply({
      content: `❌ Koin tidak cukup! Kamu punya **${userData.coins || 0} koin**.`,
      flags: 64
    })
  }

  if (activeGames.has(user.id)) {
    return interaction.reply({ content: '❌ Kamu masih punya game crash yang aktif!', flags: 64 })
  }

  // Kurangi koin
  await supabase
    .from('levels')
    .update({ coins: (userData.coins || 0) - taruhan })
    .eq('user_id', user.id)

  // Set game state
  const gameState = {
    taruhan,
    currentMultiplier: 1.00,
    history: [1.00],
    coins: userData.coins || 0,
  }
  activeGames.set(user.id, gameState)

  const embed = buildCrashEmbed(gameState, user, 'playing')
  const row = buildCrashButtons()

  await interaction.reply({ embeds: [embed], components: [row] })
}

export async function handleCrashButton(interaction) {
  const user = interaction.user
  const game = activeGames.get(user.id)

  if (!game) return interaction.reply({ content: '❌ Tidak ada game crash aktif!', flags: 64 })

  if (interaction.customId === 'crash_cashout') {
    // Cashout
    activeGames.delete(user.id)
    const won = Math.floor(game.taruhan * game.currentMultiplier)

    await supabase
      .from('levels')
      .update({ coins: game.coins - game.taruhan + won })
      .eq('user_id', user.id)

    await logTransaction(user.id, won - game.taruhan, `Game Crash cashout x${game.currentMultiplier}`)

    const embed = buildCrashEmbed(game, user, 'cashout', won)
    return interaction.update({ embeds: [embed], components: [] })
  }

  if (interaction.customId === 'crash_lanjut') {
    // Lanjut — generate multiplier baru
    const newMultiplier = generateMultiplier(game.currentMultiplier)

    if (!newMultiplier) {
      // CRASH!
      activeGames.delete(user.id)
      await logTransaction(user.id, -game.taruhan, `Game Crash — CRASH di x${game.currentMultiplier}`)

      const embed = buildCrashEmbed(game, user, 'crashed')
      return interaction.update({ embeds: [embed], components: [] })
    }

    // Update game state
    game.currentMultiplier = newMultiplier
    game.history.push(newMultiplier)
    if (game.history.length > 10) game.history.shift()
    activeGames.set(user.id, game)

    const embed = buildCrashEmbed(game, user, 'playing')
    const row = buildCrashButtons()
    return interaction.update({ embeds: [embed], components: [row] })
  }
}

function buildCrashEmbed(game, user, status, won = 0) {
  const graph = buildGraph(game.history)
  const potentialWin = Math.floor(game.taruhan * game.currentMultiplier)

  const embed = new EmbedBuilder()
    .setTitle('🚀 CRASH GAME')
    .addFields(
      { name: '💰 Taruhan', value: `${game.taruhan.toLocaleString()} koin`, inline: true },
      { name: '📈 Multiplier', value: `${game.currentMultiplier}x`, inline: true },
      { name: '💵 Potensi Dapat', value: `${potentialWin.toLocaleString()} koin`, inline: true },
    )

  if (status === 'playing') {
    embed.setDescription(`\`\`\`\n${graph}\`\`\`\nPilih aksi kamu!`)
    embed.setColor(0x5865F2)
  } else if (status === 'cashout') {
    embed.setDescription(`✅ **CASHOUT!** Kamu berhasil cashout di **${game.currentMultiplier}x**!`)
    embed.addFields({ name: '🎉 Kamu Dapat', value: `+${(won - game.taruhan).toLocaleString()} koin profit!` })
    embed.setColor(0x57F287)
  } else if (status === 'crashed') {
    embed.setDescription(`💥 **CRASH!** Crash di **${game.currentMultiplier}x**! Koin hangus!`)
    embed.addFields({ name: '💸 Kamu Kehilangan', value: `-${game.taruhan.toLocaleString()} koin` })
    embed.setColor(0xED4245)
  }

  embed.setFooter({ text: `${user.username} • ⭐ Premium` })
  embed.setTimestamp()
  return embed
}

function buildCrashButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('crash_cashout').setLabel('💰 Cashout').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('crash_lanjut').setLabel('📈 Lanjut').setStyle(ButtonStyle.Primary),
  )
}