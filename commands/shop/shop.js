import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import supabase from '../../database/supabase.js'

// ============================================================
// DAFTAR ITEM SHOP
// Untuk menambah item baru, cukup tambahkan entry baru di
// bagian yang sesuai dengan kategorinya.
//
// Format:
// item_id: {
//   name: 'Nama Item',
//   emoji: '🎯',
//   description: 'Deskripsi singkat',
//   price: 1000,
//   category: 'kategori',
//   type: 'badge' | 'item',
// }
// ============================================================

export const SHOP_ITEMS = {

  // ============================================================
  // KATEGORI: BADGE EKSKLUSIF
  // Badge ini hanya bisa didapat dari shop, tidak dari aktivitas
  // Tambahkan badge baru di bawah ini dengan format yang sama
  // ============================================================
  diamond_member: {
    name: 'Diamond Member',
    emoji: '💎',
    description: 'Badge eksklusif Diamond Member',
    price: 99999,
    category: 'badge',
    type: 'badge',
  },
  king_of_server: {
    name: 'King of Server',
    emoji: '👑',
    description: 'Badge eksklusif King of Server',
    price: 99999,
    category: 'badge',
    type: 'badge',
  },
  elite_player: {
    name: 'Elite Player',
    emoji: '🔱',
    description: 'Badge eksklusif Elite Player',
    price: 99999,
    category: 'badge',
    type: 'badge',
  },
  rainbow_legend: {
    name: 'Rainbow Legend',
    emoji: '🌈',
    description: 'Badge eksklusif Rainbow Legend',
    price: 99999,
    category: 'badge',
    type: 'badge',
  },
  thunder_god: {
    name: 'Thunder God',
    emoji: '⚡',
    description: 'Badge eksklusif Thunder God',
    price: 99999,
    category: 'badge',
    type: 'badge',
  },
  // ============================================================
  // TAMBAHKAN BADGE EKSKLUSIF BARU DI SINI
  // Contoh:
  // shadow_lord: {
  //   name: 'Shadow Lord',
  //   emoji: '🌑',
  //   description: 'Badge eksklusif Shadow Lord',
  //   price: 99999,
  //   category: 'badge',
  //   type: 'badge',
  // },
  // ============================================================

  // ============================================================
  // KATEGORI: FISHING
  // Item untuk boost sistem fishing
  // Tambahkan pancing atau umpan baru di bawah ini
  // ============================================================
  pancing_fiber: {
    name: 'Pancing Fiber',
    emoji: '🎣',
    description: '+5% chance dapat ikan rare',
    price: 500,
    category: 'fishing',
    type: 'item',
  },
  pancing_carbon: {
    name: 'Pancing Carbon',
    emoji: '🎣',
    description: '+10% chance dapat ikan rare',
    price: 2000,
    category: 'fishing',
    type: 'item',
  },
  pancing_legendary: {
    name: 'Pancing Legendary',
    emoji: '🎣',
    description: '+20% chance dapat ikan legendary',
    price: 10000,
    category: 'fishing',
    type: 'item',
  },
  umpan_udang: {
    name: 'Umpan Udang',
    emoji: '🦐',
    description: '+10% chance dapat ikan uncommon',
    price: 100,
    category: 'fishing',
    type: 'item',
  },
  umpan_ulat: {
    name: 'Umpan Ulat Sutra',
    emoji: '🐛',
    description: '+15% chance dapat ikan rare',
    price: 300,
    category: 'fishing',
    type: 'item',
  },
  umpan_kristal: {
    name: 'Umpan Kristal',
    emoji: '💎',
    description: '+10% chance dapat ikan epic',
    price: 1000,
    category: 'fishing',
    type: 'item',
  },
  // ============================================================
  // TAMBAHKAN ITEM FISHING BARU DI SINI
  // ============================================================

  // ============================================================
  // KATEGORI: BOOST
  // Item boost sementara untuk XP dan koin
  // Tambahkan boost baru di bawah ini
  // ============================================================
  xp_boost: {
    name: 'XP Boost 2x',
    emoji: '⚡',
    description: 'Double XP dari ngobrol selama 1 jam',
    price: 1500,
    category: 'boost',
    type: 'item',
  },
  coin_boost: {
    name: 'Coin Boost 2x',
    emoji: '💰',
    description: 'Double koin dari games selama 1 jam',
    price: 1500,
    category: 'boost',
    type: 'item',
  },
  lucky_charm: {
    name: 'Lucky Charm',
    emoji: '🍀',
    description: 'Boost chance loot box rare selama 1 jam',
    price: 2000,
    category: 'boost',
    type: 'item',
  },
  // ============================================================
  // TAMBAHKAN ITEM BOOST BARU DI SINI
  // ============================================================

}

// ============================================================
// SLASH COMMAND /shop
// ============================================================
export const shopData = new SlashCommandBuilder()
  .setName('shop')
  .setDescription('Toko item Aetheris!')
  .addSubcommand(sub =>
    sub.setName('view')
      .setDescription('Lihat semua item di shop')
      .addStringOption(option =>
        option.setName('kategori')
          .setDescription('Filter berdasarkan kategori')
          .setRequired(false)
          .addChoices(
            { name: '🏅 Badge Eksklusif', value: 'badge' },
            { name: '🎣 Fishing', value: 'fishing' },
            { name: '⚡ Boost', value: 'boost' },
          )
      )
  )
  .addSubcommand(sub =>
    sub.setName('buy')
      .setDescription('Beli item dari shop')
      .addStringOption(option =>
        option.setName('item')
          .setDescription('Item yang mau dibeli')
          .setRequired(true)
          .addChoices(
            // Badge
            { name: '💎 Diamond Member (99.999 koin)', value: 'diamond_member' },
            { name: '👑 King of Server (99.999 koin)', value: 'king_of_server' },
            { name: '🔱 Elite Player (99.999 koin)', value: 'elite_player' },
            { name: '🌈 Rainbow Legend (99.999 koin)', value: 'rainbow_legend' },
            { name: '⚡ Thunder God (99.999 koin)', value: 'thunder_god' },
            // Fishing
            { name: '🎣 Pancing Fiber (500 koin)', value: 'pancing_fiber' },
            { name: '🎣 Pancing Carbon (2.000 koin)', value: 'pancing_carbon' },
            { name: '🎣 Pancing Legendary (10.000 koin)', value: 'pancing_legendary' },
            { name: '🦐 Umpan Udang (100 koin)', value: 'umpan_udang' },
            { name: '🐛 Umpan Ulat Sutra (300 koin)', value: 'umpan_ulat' },
            { name: '💎 Umpan Kristal (1.000 koin)', value: 'umpan_kristal' },
            // Boost
            { name: '⚡ XP Boost 2x (1.500 koin)', value: 'xp_boost' },
            { name: '💰 Coin Boost 2x (1.500 koin)', value: 'coin_boost' },
            { name: '🍀 Lucky Charm (2.000 koin)', value: 'lucky_charm' },
            // ============================================================
            // TAMBAHKAN ITEM BARU DI SINI JUGA (untuk muncul di /shop buy)
            // ============================================================
          )
      )
  )

// ============================================================
// HANDLER /shop
// ============================================================
export async function handleShop(interaction) {
  const sub = interaction.options.getSubcommand()
  const user = interaction.user

  // ============================================================
  // /shop view — Lihat semua item
  // ============================================================
  if (sub === 'view') {
    const kategori = interaction.options.getString('kategori')

    const embed = new EmbedBuilder()
      .setTitle('🏪 Aetheris Shop')
      .setColor(0x5865F2)
      .setFooter({ text: 'Gunakan /shop buy untuk membeli item!' })
      .setTimestamp()

    // Filter item berdasarkan kategori
    const categories = kategori ? [kategori] : ['badge', 'fishing', 'boost']
    const categoryLabels = {
      badge: '🏅 Badge Eksklusif',
      fishing: '🎣 Fishing',
      boost: '⚡ Boost',
    }

    for (const cat of categories) {
      const items = Object.entries(SHOP_ITEMS)
        .filter(([, item]) => item.category === cat)
        .map(([, item]) => `${item.emoji} **${item.name}** — ${item.price.toLocaleString()} koin\n↳ ${item.description}`)
        .join('\n\n')

      embed.addFields({
        name: categoryLabels[cat],
        value: items || 'Tidak ada item',
        inline: false,
      })
    }

    return interaction.reply({ embeds: [embed] })
  }

  // ============================================================
  // /shop buy — Beli item
  // ============================================================
  if (sub === 'buy') {
    const itemId = interaction.options.getString('item')
    const item = SHOP_ITEMS[itemId]

    if (!item) return interaction.reply({ content: '❌ Item tidak ditemukan!', flags: 64 })

    // Ambil data user
    const { data: userData } = await supabase
      .from('levels')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!userData) return interaction.reply({ content: '❌ Kamu belum punya akun!', flags: 64 })
    if ((userData.coins || 0) < item.price) {
      return interaction.reply({
        content: `❌ Koin tidak cukup! Kamu punya **${(userData.coins || 0).toLocaleString()} koin**, butuh **${item.price.toLocaleString()} koin**.`,
        flags: 64
      })
    }

    // ============================================================
    // Handle pembelian berdasarkan type item
    // Kalau mau tambah type baru, tambahkan handler di sini
    // ============================================================
    if (item.type === 'badge') {
      // Cek apakah sudah punya badge ini
      const { data: existingBadge } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', user.id)
        .eq('badge_id', itemId)
        .single()

      if (existingBadge) {
        return interaction.reply({ content: `❌ Kamu sudah punya badge **${item.emoji} ${item.name}**!`, flags: 64 })
      }

      // Kurangi koin
      await supabase
        .from('levels')
        .update({ coins: (userData.coins || 0) - item.price })
        .eq('user_id', user.id)

      // Kasih badge
      await supabase
        .from('badges')
        .insert({ user_id: user.id, badge_id: itemId })

      const embed = new EmbedBuilder()
        .setTitle('🎉 Badge Dibeli!')
        .setDescription(`Kamu berhasil membeli badge **${item.emoji} ${item.name}**!`)
        .addFields(
          { name: '🏅 Badge', value: `${item.emoji} ${item.name}`, inline: true },
          { name: '💸 Harga', value: `${item.price.toLocaleString()} koin`, inline: true },
          { name: '💳 Sisa Koin', value: `${((userData.coins || 0) - item.price).toLocaleString()} koin`, inline: true },
        )
        .setColor(0xFFD700)
        .setFooter({ text: 'Cek /profile untuk lihat badge kamu!' })
        .setTimestamp()

      return interaction.reply({ embeds: [embed] })
    }

    if (item.type === 'item') {
      // Cek apakah sudah punya item ini
      const { data: existingItem } = await supabase
        .from('shop_inventory')
        .select('*')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .single()

      // Kurangi koin
      await supabase
        .from('levels')
        .update({ coins: (userData.coins || 0) - item.price })
        .eq('user_id', user.id)

      if (existingItem) {
        // Update quantity
        await supabase
          .from('shop_inventory')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('user_id', user.id)
          .eq('item_id', itemId)
      } else {
        // Insert baru
        await supabase
          .from('shop_inventory')
          .insert({ user_id: user.id, item_id: itemId, quantity: 1 })
      }

      const embed = new EmbedBuilder()
        .setTitle('🛒 Item Dibeli!')
        .setDescription(`Kamu berhasil membeli **${item.emoji} ${item.name}**!`)
        .addFields(
          { name: '🛒 Item', value: `${item.emoji} ${item.name}`, inline: true },
          { name: '💸 Harga', value: `${item.price.toLocaleString()} koin`, inline: true },
          { name: '💳 Sisa Koin', value: `${((userData.coins || 0) - item.price).toLocaleString()} koin`, inline: true },
          { name: '📦 Quantity', value: `${(existingItem?.quantity || 0) + 1}x`, inline: true },
        )
        .setColor(0x57F287)
        .setFooter({ text: 'Cek /inventory untuk lihat item kamu!' })
        .setTimestamp()

      return interaction.reply({ embeds: [embed] })
    }
  }
}