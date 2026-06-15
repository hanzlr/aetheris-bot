import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import supabase from '../../database/supabase.js'

// Harga loot box
const BOX_PRICES = {
  common: 500,
  rare: 1500,
  legendary: 5000,
}

// Reward per box type
function getReward(boxType) {
  if (boxType === 'common') {
    const roll = Math.random()
    if (roll < 0.7) return { type: 'coins', amount: Math.floor(Math.random() * 201) + 100, desc: '💰 Koin 100-300' }
    if (roll < 0.9) return { type: 'xp', amount: 50, desc: '✨ XP Boost +50 XP' }
    return { type: 'badge', badge: 'lucky_common', desc: '🏅 Badge Lucky Common' }
  }

  if (boxType === 'rare') {
    const roll = Math.random()
    if (roll < 0.6) return { type: 'coins', amount: Math.floor(Math.random() * 501) + 300, desc: '💰 Koin 300-800' }
    if (roll < 0.85) return { type: 'xp', amount: 150, desc: '✨ XP Boost +150 XP' }
    if (roll < 0.95) return { type: 'coins', amount: Math.floor(Math.random() * 201) + 800, desc: '💰 Koin Bonus 800-1000' }
    return { type: 'badge', badge: 'lucky_rare', desc: '💜 Badge Lucky Rare' }
  }

  if (boxType === 'legendary') {
    const roll = Math.random()
    if (roll < 0.5) return { type: 'coins', amount: Math.floor(Math.random() * 4001) + 1000, desc: '💰 Koin 1.000-5.000' }
    if (roll < 0.75) return { type: 'xp', amount: 500, desc: '✨ XP Boost +500 XP' }
    if (roll < 0.9) return { type: 'coins', amount: Math.floor(Math.random() * 2001) + 3000, desc: '💰 Koin Bonus 3.000-5.000' }
    return { type: 'badge', badge: 'lucky_legendary', desc: '🌟 Badge Lucky Legendary' }
  }
}

export const lootboxData = new SlashCommandBuilder()
  .setName('lootbox')
  .setDescription('Sistem loot box!')
  .addSubcommand(sub =>
    sub.setName('buy')
      .setDescription('Beli loot box')
      .addStringOption(option =>
        option.setName('type')
          .setDescription('Jenis loot box')
          .setRequired(true)
          .addChoices(
            { name: '🎁 Common (500 koin)', value: 'common' },
            { name: '💜 Rare (1.500 koin)', value: 'rare' },
            { name: '🌟 Legendary (5.000 koin)', value: 'legendary' },
          )
      )
  )
  .addSubcommand(sub =>
    sub.setName('open')
      .setDescription('Buka loot box')
      .addStringOption(option =>
        option.setName('type')
          .setDescription('Jenis loot box yang mau dibuka')
          .setRequired(true)
          .addChoices(
            { name: '🎁 Common', value: 'common' },
            { name: '💜 Rare', value: 'rare' },
            { name: '🌟 Legendary', value: 'legendary' },
          )
      )
  )
  .addSubcommand(sub =>
    sub.setName('inventory')
      .setDescription('Lihat loot box yang kamu punya')
  )

export async function handleLootbox(interaction) {
  const sub = interaction.options.getSubcommand()
  const user = interaction.user

  if (sub === 'buy') {
    const boxType = interaction.options.getString('type')
    const price = BOX_PRICES[boxType]

    const { data } = await supabase
      .from('levels')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!data) return interaction.reply({ content: '❌ Kamu belum punya akun!', flags: 64 })
    if ((data.coins || 0) < price) return interaction.reply({ content: `❌ Koin tidak cukup! Kamu punya **${data.coins || 0} koin**, butuh **${price} koin**.`, flags: 64 })

    // Kurangi koin
    await supabase
      .from('levels')
      .update({ coins: (data.coins || 0) - price })
      .eq('user_id', user.id)

    // Tambah loot box ke inventory
    await supabase
      .from('lootboxes')
      .insert({ user_id: user.id, box_type: boxType })

    const boxEmoji = { common: '🎁', rare: '💜', legendary: '🌟' }

    const embed = new EmbedBuilder()
      .setTitle('🎁 Loot Box Dibeli!')
      .setDescription(`Kamu berhasil membeli **${boxEmoji[boxType]} ${boxType} box**!`)
      .addFields(
        { name: '💸 Harga', value: `${price} koin`, inline: true },
        { name: '💳 Sisa Koin', value: `${(data.coins || 0) - price} koin`, inline: true },
      )
      .setColor(boxType === 'legendary' ? 0xFFD700 : boxType === 'rare' ? 0x9B59B6 : 0x57F287)
      .setFooter({ text: 'Gunakan /lootbox open untuk membuka!' })
      .setTimestamp()

    interaction.reply({ embeds: [embed] })
  }

  if (sub === 'open') {
    const boxType = interaction.options.getString('type')

    // Cek apakah punya loot box
    const { data: boxes } = await supabase
      .from('lootboxes')
      .select('*')
      .eq('user_id', user.id)
      .eq('box_type', boxType)
      .eq('opened', false)
      .limit(1)

    if (!boxes || boxes.length === 0) {
      return interaction.reply({ content: `❌ Kamu tidak punya **${boxType} box**! Beli dulu dengan /lootbox buy.`, flags: 64 })
    }

    // Mark sebagai opened
    await supabase
      .from('lootboxes')
      .update({ opened: true })
      .eq('id', boxes[0].id)

    // Dapat reward
    const reward = getReward(boxType)

    // Apply reward
    const { data: userData } = await supabase
      .from('levels')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (reward.type === 'coins') {
      await supabase
        .from('levels')
        .update({ coins: (userData.coins || 0) + reward.amount })
        .eq('user_id', user.id)
    }

    if (reward.type === 'xp') {
      const newXP = userData.xp + reward.amount
      let newLevel = userData.level
      while (newXP >= (5 * ((newLevel + 1) ** 2) + 50 * (newLevel + 1) + 100)) {
        newLevel++
      }
      await supabase
        .from('levels')
        .update({ xp: newXP, level: newLevel })
        .eq('user_id', user.id)
    }

    if (reward.type === 'badge') {
      await supabase
        .from('badges')
        .insert({ user_id: user.id, badge_id: reward.badge })
        .select()
    }

    const boxEmoji = { common: '🎁', rare: '💜', legendary: '🌟' }
    const color = boxType === 'legendary' ? 0xFFD700 : boxType === 'rare' ? 0x9B59B6 : 0x57F287

    const embed = new EmbedBuilder()
      .setTitle(`${boxEmoji[boxType]} Loot Box Dibuka!`)
      .setDescription(`✨ Spinning...`)
      .addFields(
        { name: '🎁 Box', value: `${boxType} box`, inline: true },
        { name: '🎉 Kamu Dapat!', value: reward.desc, inline: true },
      )
      .setColor(color)
      .setTimestamp()

    interaction.reply({ embeds: [embed] })
  }

  if (sub === 'inventory') {
    const { data: boxes } = await supabase
      .from('lootboxes')
      .select('*')
      .eq('user_id', user.id)
      .eq('opened', false)

    if (!boxes || boxes.length === 0) {
      return interaction.reply({ content: '❌ Kamu tidak punya loot box! Beli dengan /lootbox buy.', flags: 64 })
    }

    const common = boxes.filter(b => b.box_type === 'common').length
    const rare = boxes.filter(b => b.box_type === 'rare').length
    const legendary = boxes.filter(b => b.box_type === 'legendary').length

    const embed = new EmbedBuilder()
      .setTitle(`🎁 Inventory Loot Box ${user.username}`)
      .addFields(
        { name: '🎁 Common Box', value: `${common}x`, inline: true },
        { name: '💜 Rare Box', value: `${rare}x`, inline: true },
        { name: '🌟 Legendary Box', value: `${legendary}x`, inline: true },
      )
      .setColor(0x5865F2)
      .setFooter({ text: 'Gunakan /lootbox open untuk membuka!' })
      .setTimestamp()

    interaction.reply({ embeds: [embed] })
  }
}

// Fungsi untuk kasih loot box gratis (dipanggil dari daily atau level up)
export async function giveLootbox(userId, boxType) {
  await supabase
    .from('lootboxes')
    .insert({ user_id: userId, box_type: boxType })
}