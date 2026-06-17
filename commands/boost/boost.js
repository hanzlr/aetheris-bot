import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import supabase from '../../database/supabase.js'

// ============================================================
// DAFTAR BOOST
// Tambahkan boost baru di sini kalau ada item boost baru di shop
// ============================================================
export const BOOST_LIST = {
  xp_boost: {
    name: 'XP Boost 2x',
    emoji: '⚡',
    desc: 'Double XP dari ngobrol selama 1 jam',
    duration: 60, // menit
  },
  coin_boost: {
    name: 'Coin Boost 2x',
    emoji: '💰',
    desc: 'Double koin dari games selama 1 jam',
    duration: 60,
  },
  lucky_charm: {
    name: 'Lucky Charm',
    emoji: '🍀',
    desc: 'Boost chance loot box rare selama 1 jam',
    duration: 60,
  },
}

export const boostData = new SlashCommandBuilder()
  .setName('boost')
  .setDescription('Sistem boost!')
  .addSubcommand(sub =>
    sub.setName('use')
      .setDescription('Aktifkan boost')
      .addStringOption(option =>
        option.setName('item')
          .setDescription('Boost yang mau diaktifkan')
          .setRequired(true)
          .addChoices(
            { name: '⚡ XP Boost 2x', value: 'xp_boost' },
            { name: '💰 Coin Boost 2x', value: 'coin_boost' },
            { name: '🍀 Lucky Charm', value: 'lucky_charm' },
            // ============================================================
            // TAMBAHKAN BOOST BARU DI SINI
            // ============================================================
          )
      )
  )
  .addSubcommand(sub =>
    sub.setName('info')
      .setDescription('Lihat boost yang sedang aktif')
  )

export async function handleBoost(interaction) {
  const sub = interaction.options.getSubcommand()
  const user = interaction.user

  if (sub === 'use') {
    const itemId = interaction.options.getString('item')
    const boost = BOOST_LIST[itemId]

    // Cek apakah punya item ini di shop_inventory
    const { data: owned } = await supabase
      .from('shop_inventory')
      .select('*')
      .eq('user_id', user.id)
      .eq('item_id', itemId)
      .single()

    if (!owned || owned.quantity < 1) {
      return interaction.reply({
        content: `❌ Kamu tidak punya **${boost.emoji} ${boost.name}**! Beli dulu di /shop buy.`,
        flags: 64
      })
    }

    // Cek apakah boost ini sudah aktif
    const { data: existingBoost } = await supabase
      .from('active_boosts')
      .select('*')
      .eq('user_id', user.id)
      .eq('boost_type', itemId)
      .gte('expires_at', new Date().toISOString())
      .single()

    if (existingBoost) {
      const expiresAt = new Date(existingBoost.expires_at)
      const diffMs = expiresAt - new Date()
      const diffMinutes = Math.ceil(diffMs / (1000 * 60))
      return interaction.reply({
        content: `❌ **${boost.emoji} ${boost.name}** sudah aktif! Berakhir dalam **${diffMinutes} menit**.`,
        flags: 64
      })
    }

    // Kurangi quantity di shop_inventory
    if (owned.quantity > 1) {
      await supabase
        .from('shop_inventory')
        .update({ quantity: owned.quantity - 1 })
        .eq('user_id', user.id)
        .eq('item_id', itemId)
    } else {
      await supabase
        .from('shop_inventory')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', itemId)
    }

    // Aktifkan boost
    const expiresAt = new Date(Date.now() + boost.duration * 60 * 1000)
    await supabase
      .from('active_boosts')
      .insert({
        user_id: user.id,
        boost_type: itemId,
        expires_at: expiresAt.toISOString(),
      })

    const embed = new EmbedBuilder()
      .setTitle(`${boost.emoji} Boost Aktif!`)
      .setDescription(`**${boost.name}** sekarang aktif!`)
      .addFields(
        { name: '📊 Efek', value: boost.desc, inline: true },
        { name: '⏰ Durasi', value: `${boost.duration} menit`, inline: true },
        { name: '🕐 Berakhir', value: expiresAt.toLocaleTimeString('id-ID'), inline: true },
      )
      .setColor(0xFFD700)
      .setTimestamp()

    return interaction.reply({ embeds: [embed] })
  }

  if (sub === 'info') {
    const { data: activeBoosts } = await supabase
      .from('active_boosts')
      .select('*')
      .eq('user_id', user.id)
      .gte('expires_at', new Date().toISOString())

    if (!activeBoosts || activeBoosts.length === 0) {
      return interaction.reply({
        content: '😴 Tidak ada boost yang sedang aktif. Beli di /shop buy!',
        flags: 64
      })
    }

    const boostList = activeBoosts.map(b => {
      const boost = BOOST_LIST[b.boost_type]
      const expiresAt = new Date(b.expires_at)
      const diffMs = expiresAt - new Date()
      const diffMinutes = Math.ceil(diffMs / (1000 * 60))
      return `${boost.emoji} **${boost.name}** — berakhir dalam **${diffMinutes} menit**`
    }).join('\n')

    const embed = new EmbedBuilder()
      .setTitle(`⚡ Boost Aktif ${user.username}`)
      .setDescription(boostList)
      .setColor(0xFFD700)
      .setTimestamp()

    return interaction.reply({ embeds: [embed] })
  }
}

// ============================================================
// HELPER: Cek apakah user punya boost aktif
// Dipanggil dari leveling.js, games.js, lootbox.js
// ============================================================
export async function getActiveBoost(userId, boostType) {
  try {
    const { data } = await supabase
      .from('active_boosts')
      .select('*')
      .eq('user_id', userId)
      .eq('boost_type', boostType)
      .gte('expires_at', new Date().toISOString())
      .single()
    return data
  } catch {
    return null
  }
}