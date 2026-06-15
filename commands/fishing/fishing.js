import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import supabase from '../../database/supabase.js'

// Daftar semua ikan
export const FISH_LIST = {
  // Common
  lele: { name: 'Lele', emoji: '🐟', rarity: 'common', rarityEmoji: '🩶', minPrice: 10, maxPrice: 50 },
  mujair: { name: 'Mujair', emoji: '🐟', rarity: 'common', rarityEmoji: '🩶', minPrice: 10, maxPrice: 50 },
  nila: { name: 'Nila', emoji: '🐟', rarity: 'common', rarityEmoji: '🩶', minPrice: 15, maxPrice: 60 },

  // Uncommon
  kakap: { name: 'Kakap', emoji: '🐠', rarity: 'uncommon', rarityEmoji: '💙', minPrice: 50, maxPrice: 150 },
  kerapu: { name: 'Kerapu', emoji: '🐠', rarity: 'uncommon', rarityEmoji: '💙', minPrice: 60, maxPrice: 150 },
  bandeng: { name: 'Bandeng', emoji: '🐠', rarity: 'uncommon', rarityEmoji: '💙', minPrice: 50, maxPrice: 130 },

  // Rare
  hiu: { name: 'Hiu', emoji: '🦈', rarity: 'rare', rarityEmoji: '💜', minPrice: 150, maxPrice: 500 },
  pari: { name: 'Pari', emoji: '🐡', rarity: 'rare', rarityEmoji: '💜', minPrice: 150, maxPrice: 450 },
  tuna: { name: 'Tuna', emoji: '🐡', rarity: 'rare', rarityEmoji: '💜', minPrice: 200, maxPrice: 500 },

  // Epic
  coelacanth: { name: 'Coelacanth', emoji: '🐙', rarity: 'epic', rarityEmoji: '🧡', minPrice: 500, maxPrice: 1500 },
  arapaima: { name: 'Arapaima', emoji: '🐊', rarity: 'epic', rarityEmoji: '🧡', minPrice: 500, maxPrice: 1500 },

  // Legendary
  naga_laut: { name: 'Naga Laut', emoji: '🐉', rarity: 'legendary', rarityEmoji: '🌟', minPrice: 1500, maxPrice: 5000 },
  kraken: { name: 'Kraken', emoji: '🦑', rarity: 'legendary', rarityEmoji: '🌟', minPrice: 2000, maxPrice: 5000 },
}

// Cooldown fishing (30 detik)
const fishingCooldown = new Map()

// Random ikan berdasarkan rarity
function getRandomFish() {
  const roll = Math.random() * 100

  let pool
  if (roll < 50) pool = ['lele', 'mujair', 'nila']
  else if (roll < 80) pool = ['kakap', 'kerapu', 'bandeng']
  else if (roll < 95) pool = ['hiu', 'pari', 'tuna']
  else if (roll < 99) pool = ['coelacanth', 'arapaima']
  else pool = ['naga_laut', 'kraken']

  return pool[Math.floor(Math.random() * pool.length)]
}

export const fishingData = new SlashCommandBuilder()
  .setName('fish')
  .setDescription('Sistem fishing!')
  .addSubcommand(sub =>
    sub.setName('cast')
      .setDescription('Mancing ikan!')
  )
  .addSubcommand(sub =>
    sub.setName('sell')
      .setDescription('Jual ikan ke koin')
      .addStringOption(option =>
        option.setName('ikan')
          .setDescription('Ikan yang mau dijual (kosongkan untuk jual semua)')
          .setRequired(false)
          .addChoices(
            { name: '🩶 Lele', value: 'lele' },
            { name: '🩶 Mujair', value: 'mujair' },
            { name: '🩶 Nila', value: 'nila' },
            { name: '💙 Kakap', value: 'kakap' },
            { name: '💙 Kerapu', value: 'kerapu' },
            { name: '💙 Bandeng', value: 'bandeng' },
            { name: '💜 Hiu', value: 'hiu' },
            { name: '💜 Pari', value: 'pari' },
            { name: '💜 Tuna', value: 'tuna' },
            { name: '🧡 Coelacanth', value: 'coelacanth' },
            { name: '🧡 Arapaima', value: 'arapaima' },
            { name: '🌟 Naga Laut', value: 'naga_laut' },
            { name: '🌟 Kraken', value: 'kraken' },
          )
      )
  )

export async function handleFishing(interaction) {
  const sub = interaction.options.getSubcommand()
  const user = interaction.user

  if (sub === 'cast') {
    // Cek cooldown
    const now = Date.now()
    const lastFish = fishingCooldown.get(user.id) || 0
    const diff = (now - lastFish) / 1000

    if (diff < 30) {
      const sisa = Math.ceil(30 - diff)
      return interaction.reply({
        content: `⏳ Tunggu **${sisa} detik** lagi sebelum mancing!`,
        flags: 64
      })
    }

    // Set cooldown
    fishingCooldown.set(user.id, now)

    // Dapat ikan random
    const fishId = getRandomFish()
    const fish = FISH_LIST[fishId]

    // Simpan ke fish_inventory
    const { data: existing } = await supabase
      .from('fish_inventory')
      .select('*')
      .eq('user_id', user.id)
      .eq('fish_id', fishId)
      .single()

    if (existing) {
      await supabase
        .from('fish_inventory')
        .update({ quantity: existing.quantity + 1 })
        .eq('user_id', user.id)
        .eq('fish_id', fishId)
    } else {
      await supabase
        .from('fish_inventory')
        .insert({ user_id: user.id, fish_id: fishId, quantity: 1 })
    }

    const color = {
      common: 0x95a5a6,
      uncommon: 0x3498db,
      rare: 0x9b59b6,
      epic: 0xe67e22,
      legendary: 0xFFD700
    }[fish.rarity]

    const embed = new EmbedBuilder()
      .setTitle('🎣 Mancing!')
      .setDescription(`${fish.rarityEmoji} **${fish.rarity.toUpperCase()}** — Kamu dapat **${fish.emoji} ${fish.name}**!`)
      .addFields(
        { name: '🐟 Ikan', value: `${fish.emoji} ${fish.name}`, inline: true },
        { name: '💰 Estimasi Harga', value: `${fish.minPrice}-${fish.maxPrice} koin`, inline: true },
      )
      .setColor(color)
      .setFooter({ text: 'Gunakan /fish sell untuk jual ikan!' })
      .setTimestamp()

    // Kalau legendary, tambahin special message
    if (fish.rarity === 'legendary') {
      embed.setDescription(`🌟 **LEGENDARY!** 🌟\nLuar biasa! Kamu dapat **${fish.emoji} ${fish.name}**!`)
    }

    interaction.reply({ embeds: [embed] })
  }

  if (sub === 'sell') {
    const fishChoice = interaction.options.getString('ikan')

    // Ambil data user
    const { data: userData } = await supabase
      .from('levels')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!userData) return interaction.reply({ content: '❌ Kamu belum punya akun!', flags: 64 })

    if (fishChoice) {
      // Jual ikan tertentu
      const { data: fishData } = await supabase
        .from('fish_inventory')
        .select('*')
        .eq('user_id', user.id)
        .eq('fish_id', fishChoice)
        .single()

      if (!fishData || fishData.quantity === 0) {
        return interaction.reply({ content: `❌ Kamu tidak punya **${FISH_LIST[fishChoice].name}**!`, flags: 64 })
      }

      const fish = FISH_LIST[fishChoice]
      const pricePerFish = Math.floor(Math.random() * (fish.maxPrice - fish.minPrice + 1)) + fish.minPrice
      const totalPrice = pricePerFish * fishData.quantity

      // Update koin
      await supabase
        .from('levels')
        .update({ coins: (userData.coins || 0) + totalPrice })
        .eq('user_id', user.id)

      // Hapus ikan dari inventory
      await supabase
        .from('fish_inventory')
        .delete()
        .eq('user_id', user.id)
        .eq('fish_id', fishChoice)

      const embed = new EmbedBuilder()
        .setTitle('💰 Ikan Terjual!')
        .addFields(
          { name: '🐟 Ikan', value: `${fish.emoji} ${fish.name} x${fishData.quantity}`, inline: true },
          { name: '💰 Harga Per Ekor', value: `${pricePerFish} koin`, inline: true },
          { name: '💳 Total Didapat', value: `+${totalPrice} koin`, inline: true },
          { name: '💳 Koin Sekarang', value: `${(userData.coins || 0) + totalPrice} koin`, inline: false },
        )
        .setColor(0x57F287)
        .setTimestamp()

      interaction.reply({ embeds: [embed] })

    } else {
      // Jual semua ikan
      const { data: allFish } = await supabase
        .from('fish_inventory')
        .select('*')
        .eq('user_id', user.id)

      if (!allFish || allFish.length === 0) {
        return interaction.reply({ content: '❌ Kamu tidak punya ikan! Mancing dulu dengan /fish cast.', flags: 64 })
      }

      let totalCoins = 0
      const soldList = []

      for (const fishItem of allFish) {
        const fish = FISH_LIST[fishItem.fish_id]
        const pricePerFish = Math.floor(Math.random() * (fish.maxPrice - fish.minPrice + 1)) + fish.minPrice
        const total = pricePerFish * fishItem.quantity
        totalCoins += total
        soldList.push(`${fish.emoji} ${fish.name} x${fishItem.quantity} = ${total} koin`)
      }

      // Update koin
      await supabase
        .from('levels')
        .update({ coins: (userData.coins || 0) + totalCoins })
        .eq('user_id', user.id)

      // Hapus semua ikan
      await supabase
        .from('fish_inventory')
        .delete()
        .eq('user_id', user.id)

      const embed = new EmbedBuilder()
        .setTitle('💰 Semua Ikan Terjual!')
        .setDescription(soldList.join('\n'))
        .addFields(
          { name: '💳 Total Didapat', value: `+${totalCoins} koin`, inline: true },
          { name: '💳 Koin Sekarang', value: `${(userData.coins || 0) + totalCoins} koin`, inline: true },
        )
        .setColor(0x57F287)
        .setTimestamp()

      interaction.reply({ embeds: [embed] })
    }
  }
}