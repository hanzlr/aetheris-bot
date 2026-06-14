import { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import supabase from '../../database/supabase.js'

// Simpan state blackjack yang sedang berlangsung
const activeGames = new Map()

// ===== HELPER =====
async function getUser(userId) {
  const { data } = await supabase
    .from('levels')
    .select('*')
    .eq('user_id', userId)
    .single()
  return data
}

async function updateCoins(userId, newCoins) {
  await supabase
    .from('levels')
    .update({ coins: newCoins })
    .eq('user_id', userId)
}

const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const cardValue = (card) => {
  if (['J', 'Q', 'K'].includes(card)) return 10
  if (card === 'A') return 11
  return parseInt(card)
}
const randomCard = () => cards[Math.floor(Math.random() * cards.length)]
const totalCards = (cards) => cards.reduce((sum, c) => sum + cardValue(c), 0)

// ===== DICE ROLL =====
export const diceData = new SlashCommandBuilder()
  .setName('dice')
  .setDescription('Adu dadu lawan bot!')
  .addIntegerOption(option =>
    option.setName('taruhan')
      .setDescription('Jumlah koin yang mau ditaruhkan')
      .setRequired(true)
  )

export async function handleDice(interaction) {
  const user = interaction.user
  const taruhan = interaction.options.getInteger('taruhan')

  if (taruhan <= 0) return interaction.reply({ content: '❌ Taruhan harus lebih dari 0!', flags: 64 })

  const data = await getUser(user.id)
  if (!data) return interaction.reply({ content: '❌ Kamu belum punya akun!', flags: 64 })
  if ((data.coins || 0) < taruhan) return interaction.reply({ content: `❌ Koin tidak cukup! Kamu punya **${data.coins || 0} koin**.`, flags: 64 })

  const playerDice = Math.floor(Math.random() * 6) + 1
  const botDice = Math.floor(Math.random() * 6) + 1

  let result, newCoins, color
  if (playerDice > botDice) {
    result = `🎉 Kamu menang! +${taruhan} koin`
    newCoins = (data.coins || 0) + taruhan
    color = 0x57F287
  } else if (playerDice < botDice) {
    result = `😢 Kamu kalah! -${taruhan} koin`
    newCoins = (data.coins || 0) - taruhan
    color = 0xED4245
  } else {
    result = `🤝 Seri! Koin kembali.`
    newCoins = data.coins || 0
    color = 0xFFD700
  }

  await updateCoins(user.id, newCoins)

  const embed = new EmbedBuilder()
    .setTitle('🎲 Dice Roll!')
    .addFields(
      { name: '🎲 Dadu Kamu', value: `${playerDice}`, inline: true },
      { name: '🤖 Dadu Bot', value: `${botDice}`, inline: true },
      { name: '📊 Hasil', value: result, inline: false },
      { name: '💳 Koin Sekarang', value: `${newCoins} koin`, inline: false },
    )
    .setColor(color)
    .setTimestamp()

  interaction.reply({ embeds: [embed] })
}

// ===== COINFLIP =====
export const coinflipData = new SlashCommandBuilder()
  .setName('coinflip')
  .setDescription('Tebak koin — heads atau tails!')
  .addStringOption(option =>
    option.setName('pilihan')
      .setDescription('Pilih heads atau tails')
      .setRequired(true)
      .addChoices(
        { name: 'Heads', value: 'heads' },
        { name: 'Tails', value: 'tails' }
      )
  )
  .addIntegerOption(option =>
    option.setName('taruhan')
      .setDescription('Jumlah koin yang mau ditaruhkan')
      .setRequired(true)
  )

export async function handleCoinflip(interaction) {
  const user = interaction.user
  const pilihan = interaction.options.getString('pilihan')
  const taruhan = interaction.options.getInteger('taruhan')

  if (taruhan <= 0) return interaction.reply({ content: '❌ Taruhan harus lebih dari 0!', flags: 64 })

  const data = await getUser(user.id)
  if (!data) return interaction.reply({ content: '❌ Kamu belum punya akun!', flags: 64 })
  if ((data.coins || 0) < taruhan) return interaction.reply({ content: `❌ Koin tidak cukup! Kamu punya **${data.coins || 0} koin**.`, flags: 64 })

  const hasil = Math.random() < 0.5 ? 'heads' : 'tails'
  const menang = pilihan === hasil

  const newCoins = menang ? (data.coins || 0) + taruhan : (data.coins || 0) - taruhan
  await updateCoins(user.id, newCoins)

  const embed = new EmbedBuilder()
    .setTitle('🪙 Coinflip!')
    .addFields(
      { name: '✋ Pilihan Kamu', value: pilihan === 'heads' ? '👑 Heads' : '🔵 Tails', inline: true },
      { name: '🪙 Hasil', value: hasil === 'heads' ? '👑 Heads' : '🔵 Tails', inline: true },
      { name: '📊 Hasil', value: menang ? `🎉 Menang! +${taruhan} koin` : `😢 Kalah! -${taruhan} koin`, inline: false },
      { name: '💳 Koin Sekarang', value: `${newCoins} koin`, inline: false },
    )
    .setColor(menang ? 0x57F287 : 0xED4245)
    .setTimestamp()

  interaction.reply({ embeds: [embed] })
}

// ===== SLOT MACHINE =====
export const slotData = new SlashCommandBuilder()
  .setName('slot')
  .setDescription('Spin slot machine!')
  .addIntegerOption(option =>
    option.setName('taruhan')
      .setDescription('Jumlah koin yang mau ditaruhkan')
      .setRequired(true)
  )

export async function handleSlot(interaction) {
  const user = interaction.user
  const taruhan = interaction.options.getInteger('taruhan')

  if (taruhan <= 0) return interaction.reply({ content: '❌ Taruhan harus lebih dari 0!', flags: 64 })

  const data = await getUser(user.id)
  if (!data) return interaction.reply({ content: '❌ Kamu belum punya akun!', flags: 64 })
  if ((data.coins || 0) < taruhan) return interaction.reply({ content: `❌ Koin tidak cukup! Kamu punya **${data.coins || 0} koin**.`, flags: 64 })

  const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎']
  const s1 = symbols[Math.floor(Math.random() * symbols.length)]
  const s2 = symbols[Math.floor(Math.random() * symbols.length)]
  const s3 = symbols[Math.floor(Math.random() * symbols.length)]

  let newCoins, result, color
  if (s1 === s2 && s2 === s3) {
    if (s1 === '💎') {
      newCoins = (data.coins || 0) + taruhan * 10
      result = `💎 JACKPOT! +${taruhan * 10} koin!`
      color = 0xFFD700
    } else {
      newCoins = (data.coins || 0) + taruhan * 3
      result = `🎉 Tiga sama! +${taruhan * 3} koin!`
      color = 0x57F287
    }
  } else if (s1 === s2 || s2 === s3 || s1 === s3) {
    newCoins = (data.coins || 0) + taruhan
    result = `✨ Dua sama! +${taruhan} koin!`
    color = 0x5865F2
  } else {
    newCoins = (data.coins || 0) - taruhan
    result = `😢 Tidak ada yang sama! -${taruhan} koin`
    color = 0xED4245
  }

  await updateCoins(user.id, newCoins)

  const embed = new EmbedBuilder()
    .setTitle('🎰 Slot Machine!')
    .setDescription(`# ${s1} | ${s2} | ${s3}`)
    .addFields(
      { name: '📊 Hasil', value: result, inline: false },
      { name: '💳 Koin Sekarang', value: `${newCoins} koin`, inline: false },
    )
    .setColor(color)
    .setTimestamp()

  interaction.reply({ embeds: [embed] })
}

// ===== BLACKJACK =====
export const blackjackData = new SlashCommandBuilder()
  .setName('blackjack')
  .setDescription('Main blackjack lawan bot!')
  .addIntegerOption(option =>
    option.setName('taruhan')
      .setDescription('Jumlah koin yang mau ditaruhkan')
      .setRequired(true)
  )

function buildBlackjackEmbed(playerCards, botCards, playerTotal, status) {
  const embed = new EmbedBuilder()
    .setTitle('🃏 Blackjack!')
    .addFields(
      { name: '🃏 Kartu Kamu', value: `${playerCards.join(' ')} = **${playerTotal}**`, inline: true },
      { name: '🤖 Kartu Bot', value: status === 'playing' ? `${botCards[0]} + ❓` : `${botCards.join(' ')} = **${totalCards(botCards)}**`, inline: true },
    )

  if (status === 'playing') {
    embed.setDescription('Pilih aksi kamu:')
    embed.setColor(0x5865F2)
  }

  return embed
}

export async function handleBlackjack(interaction) {
  const user = interaction.user
  const taruhan = interaction.options.getInteger('taruhan')

  if (taruhan <= 0) return interaction.reply({ content: '❌ Taruhan harus lebih dari 0!', flags: 64 })

  const data = await getUser(user.id)
  if (!data) return interaction.reply({ content: '❌ Kamu belum punya akun!', flags: 64 })
  if ((data.coins || 0) < taruhan) return interaction.reply({ content: `❌ Koin tidak cukup! Kamu punya **${data.coins || 0} koin**.`, flags: 64 })

  // Cek apakah sudah ada game aktif
  if (activeGames.has(user.id)) {
    return interaction.reply({ content: '❌ Kamu masih punya game blackjack yang belum selesai!', flags: 64 })
  }

  const playerCards = [randomCard(), randomCard()]
  const botCards = [randomCard(), randomCard()]
  const playerTotal = totalCards(playerCards)

  // Simpan state game
  activeGames.set(user.id, { playerCards, botCards, taruhan, coins: data.coins || 0 })

  const embed = buildBlackjackEmbed(playerCards, botCards, playerTotal, 'playing')

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('bj_hit')
      .setLabel('🃏 Hit')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('bj_stand')
      .setLabel('✋ Stand')
      .setStyle(ButtonStyle.Secondary),
  )

  // Kalau langsung blackjack
  if (playerTotal === 21) {
    activeGames.delete(user.id)
    const newCoins = (data.coins || 0) + taruhan
    await updateCoins(user.id, newCoins)
    embed.setDescription('🎉 BLACKJACK! Kamu menang!')
    embed.addFields({ name: '💳 Koin Sekarang', value: `${newCoins} koin` })
    embed.setColor(0xFFD700)
    return interaction.reply({ embeds: [embed] })
  }

  await interaction.reply({ embeds: [embed], components: [row] })
}

// Handle tombol Hit & Stand
export async function handleBlackjackButton(interaction) {
  const user = interaction.user
  const game = activeGames.get(user.id)

  if (!game) {
    return interaction.reply({ content: '❌ Tidak ada game blackjack aktif!', flags: 64 })
  }

  let { playerCards, botCards, taruhan, coins } = game

  if (interaction.customId === 'bj_hit') {
    // Ambil kartu baru
    playerCards.push(randomCard())
    const playerTotal = totalCards(playerCards)

    if (playerTotal > 21) {
      // Bust!
      activeGames.delete(user.id)
      const newCoins = coins - taruhan
      await updateCoins(user.id, newCoins)

      const embed = buildBlackjackEmbed(playerCards, botCards, playerTotal, 'end')
      embed.addFields(
        { name: '📊 Hasil', value: `😢 Bust! Kamu melebihi 21! -${taruhan} koin` },
        { name: '💳 Koin Sekarang', value: `${newCoins} koin` }
      )
      embed.setColor(0xED4245)
      return interaction.update({ embeds: [embed], components: [] })
    }

    if (playerTotal === 21) {
      // Otomatis stand kalau 21
      return await resolveStand(interaction, game, playerCards)
    }

    // Update embed dengan kartu baru
    const embed = buildBlackjackEmbed(playerCards, botCards, playerTotal, 'playing')
    embed.setDescription('Pilih aksi kamu:')

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('bj_hit').setLabel('🃏 Hit').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('bj_stand').setLabel('✋ Stand').setStyle(ButtonStyle.Secondary),
    )

    activeGames.set(user.id, { ...game, playerCards })
    return interaction.update({ embeds: [embed], components: [row] })
  }

  if (interaction.customId === 'bj_stand') {
    return await resolveStand(interaction, game, playerCards)
  }
}

async function resolveStand(interaction, game, playerCards) {
  const { botCards, taruhan, coins } = game
  const user = interaction.user

  // Bot terus ambil kartu sampai 17+
  while (totalCards(botCards) < 17) {
    botCards.push(randomCard())
  }

  const playerTotal = totalCards(playerCards)
  const botTotal = totalCards(botCards)

  let result, newCoins, color
  if (botTotal > 21 || playerTotal > botTotal) {
    result = `🎉 Kamu menang! +${taruhan} koin`
    newCoins = coins + taruhan
    color = 0x57F287
  } else if (playerTotal < botTotal) {
    result = `😢 Kamu kalah! -${taruhan} koin`
    newCoins = coins - taruhan
    color = 0xED4245
  } else {
    result = `🤝 Seri! Koin kembali.`
    newCoins = coins
    color = 0xFFD700
  }

  activeGames.delete(user.id)
  await updateCoins(user.id, newCoins)

  const embed = buildBlackjackEmbed(playerCards, botCards, playerTotal, 'end')
  embed.addFields(
    { name: '📊 Hasil', value: result },
    { name: '💳 Koin Sekarang', value: `${newCoins} koin` }
  )
  embed.setColor(color)

  return interaction.update({ embeds: [embed], components: [] })
}