import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import supabase from '../../database/supabase.js'
import { isPremium } from '../premium/premium.js'

export const giftData = new SlashCommandBuilder()
  .setName('gift')
  .setDescription('Transfer koin ke member lain (Premium only)')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('Member yang mau dikasih koin')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('jumlah')
      .setDescription('Jumlah koin yang mau dikirim')
      .setRequired(true)
  )

export async function handleGift(interaction) {
  const user = interaction.user
  const target = interaction.options.getUser('user')
  const jumlah = interaction.options.getInteger('jumlah')

  // Cek premium
  const userIsPremium = await isPremium(user.id)
  if (!userIsPremium) {
    return interaction.reply({
      content: '❌ Fitur ini khusus untuk member **⭐ PREMIUM**! Hubungi admin untuk mendapatkan key.',
      flags: 64
    })
  }

  // Validasi
  if (target.id === user.id) {
    return interaction.reply({
      content: '❌ Kamu tidak bisa transfer koin ke diri sendiri!',
      flags: 64
    })
  }

  if (target.bot) {
    return interaction.reply({
      content: '❌ Kamu tidak bisa transfer koin ke bot!',
      flags: 64
    })
  }

  if (jumlah <= 0) {
    return interaction.reply({
      content: '❌ Jumlah koin harus lebih dari 0!',
      flags: 64
    })
  }

  // Ambil data sender
  const { data: senderData } = await supabase
    .from('levels')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!senderData) return interaction.reply({ content: '❌ Kamu belum punya akun!', flags: 64 })
  if ((senderData.coins || 0) < jumlah) {
    return interaction.reply({
      content: `❌ Koin tidak cukup! Kamu punya **${senderData.coins || 0} koin**.`,
      flags: 64
    })
  }

  // Ambil data target
  const { data: targetData } = await supabase
    .from('levels')
    .select('*')
    .eq('user_id', target.id)
    .single()

  if (!targetData) {
    return interaction.reply({
      content: '❌ Member tersebut belum punya akun!',
      flags: 64
    })
  }

  // Transfer koin
  await supabase
    .from('levels')
    .update({ coins: (senderData.coins || 0) - jumlah })
    .eq('user_id', user.id)

  await supabase
    .from('levels')
    .update({ coins: (targetData.coins || 0) + jumlah })
    .eq('user_id', target.id)

  const embed = new EmbedBuilder()
    .setTitle('💸 Transfer Koin Berhasil!')
    .addFields(
      { name: '👤 Pengirim', value: `${user.username}`, inline: true },
      { name: '👤 Penerima', value: `${target.username}`, inline: true },
      { name: '💰 Jumlah', value: `${jumlah.toLocaleString()} koin`, inline: true },
      { name: '💳 Sisa Koin Kamu', value: `${((senderData.coins || 0) - jumlah).toLocaleString()} koin`, inline: true },
    )
    .setColor(0x57F287)
    .setTimestamp()

  interaction.reply({ embeds: [embed] })
}