import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import supabase from '../../database/supabase.js'

// ============================================================
// DAFTAR PANCING & UMPAN YANG BISA DI-EQUIP
// Tambahkan item baru di sini kalau ada item fishing baru di shop
// ============================================================

export const PANCING_LIST = {
  // Default (gratis, semua orang punya)
  pancing_bambu: {
    name: 'Pancing Bambu',
    emoji: '🎣',
    description: 'Pancing default',
    bonus: {
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    }
  },
  // Item dari shop
  pancing_fiber: {
    name: 'Pancing Fiber',
    emoji: '🎣',
    description: '+5% chance dapat ikan rare',
    bonus: {
      uncommon: 0,
      rare: 5,
      epic: 0,
      legendary: 0,
    }
  },
  pancing_carbon: {
    name: 'Pancing Carbon',
    emoji: '🎣',
    description: '+10% chance dapat ikan rare',
    bonus: {
      uncommon: 0,
      rare: 10,
      epic: 0,
      legendary: 0,
    }
  },
  pancing_legendary: {
    name: 'Pancing Legendary',
    emoji: '🎣',
    description: '+20% chance dapat ikan legendary',
    bonus: {
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 20,
    }
  },
  // ============================================================
  // TAMBAHKAN PANCING BARU DI SINI
  // ============================================================
}

export const UMPAN_LIST = {
  // Default (gratis, semua orang punya)
  cacing: {
    name: 'Cacing',
    emoji: '🪱',
    description: 'Umpan default',
    bonus: {
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    }
  },
  // Item dari shop
  umpan_udang: {
    name: 'Umpan Udang',
    emoji: '🦐',
    description: '+10% chance dapat ikan uncommon',
    bonus: {
      uncommon: 10,
      rare: 0,
      epic: 0,
      legendary: 0,
    }
  },
  umpan_ulat: {
    name: 'Umpan Ulat Sutra',
    emoji: '🐛',
    description: '+15% chance dapat ikan rare',
    bonus: {
      uncommon: 0,
      rare: 15,
      epic: 0,
      legendary: 0,
    }
  },
  umpan_kristal: {
    name: 'Umpan Kristal',
    emoji: '💎',
    description: '+10% chance dapat ikan epic',
    bonus: {
      uncommon: 0,
      rare: 0,
      epic: 10,
      legendary: 0,
    }
  },
  // ============================================================
  // TAMBAHKAN UMPAN BARU DI SINI
  // ============================================================
}

export const equipData = new SlashCommandBuilder()
  .setName('equip')
  .setDescription('Equip pancing atau umpan')
  .addSubcommand(sub =>
    sub.setName('pancing')
      .setDescription('Pilih pancing yang mau dipakai')
      .addStringOption(option =>
        option.setName('item')
          .setDescription('Pancing yang mau di-equip')
          .setRequired(true)
          .addChoices(
            { name: '🎣 Pancing Bambu (Default)', value: 'pancing_bambu' },
            { name: '🎣 Pancing Fiber (+5% rare)', value: 'pancing_fiber' },
            { name: '🎣 Pancing Carbon (+10% rare)', value: 'pancing_carbon' },
            { name: '🎣 Pancing Legendary (+20% legendary)', value: 'pancing_legendary' },
            // ============================================================
            // TAMBAHKAN PILIHAN PANCING BARU DI SINI
            // ============================================================
          )
      )
  )
  .addSubcommand(sub =>
    sub.setName('umpan')
      .setDescription('Pilih umpan yang mau dipakai')
      .addStringOption(option =>
        option.setName('item')
          .setDescription('Umpan yang mau di-equip')
          .setRequired(true)
          .addChoices(
            { name: '🪱 Cacing (Default)', value: 'cacing' },
            { name: '🦐 Umpan Udang (+10% uncommon)', value: 'umpan_udang' },
            { name: '🐛 Umpan Ulat Sutra (+15% rare)', value: 'umpan_ulat' },
            { name: '💎 Umpan Kristal (+10% epic)', value: 'umpan_kristal' },
            // ============================================================
            // TAMBAHKAN PILIHAN UMPAN BARU DI SINI
            // ============================================================
          )
      )
  )
  .addSubcommand(sub =>
    sub.setName('info')
      .setDescription('Lihat pancing & umpan yang sedang dipakai')
  )

export async function handleEquip(interaction) {
  const sub = interaction.options.getSubcommand()
  const user = interaction.user

  if (sub === 'pancing') {
    const itemId = interaction.options.getString('item')
    const pancing = PANCING_LIST[itemId]

    // Cek apakah punya item ini (skip kalau default)
    if (itemId !== 'pancing_bambu') {
      const { data: owned } = await supabase
        .from('shop_inventory')
        .select('*')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .single()

      if (!owned) {
        return interaction.reply({
          content: `❌ Kamu belum punya **${pancing.emoji} ${pancing.name}**! Beli dulu di /shop buy.`,
          flags: 64
        })
      }
    }

    // Equip pancing
    await supabase
      .from('levels')
      .update({ equipped_pancing: itemId })
      .eq('user_id', user.id)

    const embed = new EmbedBuilder()
      .setTitle('🎣 Pancing Di-equip!')
      .setDescription(`Kamu sekarang memakai **${pancing.emoji} ${pancing.name}**!`)
      .addFields(
        { name: '🎣 Pancing', value: pancing.name, inline: true },
        { name: '📊 Bonus', value: pancing.description, inline: true },
      )
      .setColor(0x5865F2)
      .setTimestamp()

    return interaction.reply({ embeds: [embed] })
  }

  if (sub === 'umpan') {
    const itemId = interaction.options.getString('item')
    const umpan = UMPAN_LIST[itemId]

    // Cek apakah punya item ini (skip kalau default)
    if (itemId !== 'cacing') {
      const { data: owned } = await supabase
        .from('shop_inventory')
        .select('*')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .single()

      if (!owned) {
        return interaction.reply({
          content: `❌ Kamu belum punya **${umpan.emoji} ${umpan.name}**! Beli dulu di /shop buy.`,
          flags: 64
        })
      }
    }

    // Equip umpan
    await supabase
      .from('levels')
      .update({ equipped_umpan: itemId })
      .eq('user_id', user.id)

    const embed = new EmbedBuilder()
      .setTitle('🪱 Umpan Di-equip!')
      .setDescription(`Kamu sekarang memakai **${umpan.emoji} ${umpan.name}**!`)
      .addFields(
        { name: '🪱 Umpan', value: umpan.name, inline: true },
        { name: '📊 Bonus', value: umpan.description, inline: true },
      )
      .setColor(0x5865F2)
      .setTimestamp()

    return interaction.reply({ embeds: [embed] })
  }

  if (sub === 'info') {
    const { data: userData } = await supabase
      .from('levels')
      .select('equipped_pancing, equipped_umpan')
      .eq('user_id', user.id)
      .single()

    if (!userData) return interaction.reply({ content: '❌ Kamu belum punya akun!', flags: 64 })

    const pancing = PANCING_LIST[userData.equipped_pancing || 'pancing_bambu']
    const umpan = UMPAN_LIST[userData.equipped_umpan || 'cacing']

    const embed = new EmbedBuilder()
      .setTitle(`🎣 Equip ${interaction.user.username}`)
      .addFields(
        { name: '🎣 Pancing', value: `${pancing.emoji} ${pancing.name}\n${pancing.description}`, inline: true },
        { name: '🪱 Umpan', value: `${umpan.emoji} ${umpan.name}\n${umpan.description}`, inline: true },
      )
      .setColor(0x5865F2)
      .setTimestamp()

    return interaction.reply({ embeds: [embed] })
  }
}