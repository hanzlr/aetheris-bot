import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import supabase from '../../database/supabase.js'

export const inventoryData = new SlashCommandBuilder()
  .setName('inventory')
  .setDescription('Lihat semua item yang kamu punya')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('Member yang mau dilihat (opsional)')
      .setRequired(false)
  )

export async function handleInventory(interaction) {
  const target = interaction.options.getUser('user') || interaction.user

  // Ambil data user
  const { data: userData } = await supabase
    .from('levels')
    .select('*')
    .eq('user_id', target.id)
    .single()

  if (!userData) return interaction.reply({ content: '❌ User ini belum punya akun!', flags: 64 })

  // Ambil loot box
  const { data: boxes } = await supabase
    .from('lootboxes')
    .select('*')
    .eq('user_id', target.id)
    .eq('opened', false)

  const common = boxes?.filter(b => b.box_type === 'common').length || 0
  const rare = boxes?.filter(b => b.box_type === 'rare').length || 0
  const legendary = boxes?.filter(b => b.box_type === 'legendary').length || 0

  // Ambil badges
  const { data: badges } = await supabase
    .from('badges')
    .select('badge_id')
    .eq('user_id', target.id)

  const badgeList = badges?.length > 0
    ? badges.map(b => `🏅 ${b.badge_id}`).join('\n')
    : 'Belum ada badge'

  const embed = new EmbedBuilder()
    .setTitle(`🎒 Inventory ${target.username}`)
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      // Ekonomi
      {
        name: '💰 Ekonomi',
        value: [
          `💳 Wallet: ${(userData.coins || 0).toLocaleString()} koin`,
          `🏦 Bank: ${(userData.bank || 0).toLocaleString()} koin`,
        ].join('\n'),
        inline: false
      },
      // Loot Box
      {
        name: '🎁 Loot Box',
        value: [
          `🎁 Common: ${common}x`,
          `💜 Rare: ${rare}x`,
          `🌟 Legendary: ${legendary}x`,
        ].join('\n'),
        inline: false
      },
      // Badges
      {
        name: '🏅 Badges',
        value: badgeList,
        inline: false
      },
    )
    .setColor(0x5865F2)
    .setFooter({ text: 'UMB Esport • Inventory' })
    .setTimestamp()

  interaction.reply({ embeds: [embed] })
}