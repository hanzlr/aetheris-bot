import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import supabase from '../../database/supabase.js'

export const premiumData = new SlashCommandBuilder()
  .setName('premium')
  .setDescription('Sistem premium')
  .addSubcommand(sub =>
    sub.setName('redeem')
      .setDescription('Redeem premium key')
      .addStringOption(option =>
        option.setName('key')
          .setDescription('Masukkan premium key kamu')
          .setRequired(true)
      )
  )
  .addSubcommand(sub =>
    sub.setName('status')
      .setDescription('Lihat status premium kamu')
  )

export async function handlePremium(interaction) {
  const sub = interaction.options.getSubcommand()
  const user = interaction.user

  if (sub === 'redeem') {
    const key = interaction.options.getString('key').toUpperCase().trim()

    // Cek key di database
    const { data: keyData } = await supabase
      .from('premium_keys')
      .select('*')
      .eq('key', key)
      .single()

    if (!keyData) {
      return interaction.reply({
        content: '❌ Key tidak valid! Pastikan key yang kamu masukkan benar.',
        flags: 64
      })
    }

    if (keyData.status === 'used') {
      return interaction.reply({
        content: '❌ Key ini sudah pernah digunakan!',
        flags: 64
      })
    }

    // Hitung expiry date
    const now = new Date()
    let expiresAt = null
    let durationText = ''

    if (keyData.duration === '1month') {
      expiresAt = new Date(now.setMonth(now.getMonth() + 1))
      durationText = '1 Bulan'
    } else if (keyData.duration === '3month') {
      expiresAt = new Date(now.setMonth(now.getMonth() + 3))
      durationText = '3 Bulan'
    } else if (keyData.duration === 'permanent') {
      expiresAt = null
      durationText = 'Permanent'
    }

    // Update key status
    await supabase
      .from('premium_keys')
      .update({
        status: 'used',
        used_by: user.id,
        used_at: new Date().toISOString()
      })
      .eq('key', key)

    // Update user premium status
    await supabase
      .from('levels')
      .update({
        is_premium: true,
        premium_expires_at: expiresAt?.toISOString() || null
      })
      .eq('user_id', user.id)

    const embed = new EmbedBuilder()
      .setTitle('⭐ Premium Aktif!')
      .setDescription(`Selamat **${user.username}**! Kamu sekarang adalah member Premium! 🎉`)
      .addFields(
        { name: '⭐ Status', value: 'PREMIUM', inline: true },
        { name: '⏰ Durasi', value: durationText, inline: true },
        { name: '📅 Berakhir', value: expiresAt ? expiresAt.toLocaleDateString('id-ID') : 'Tidak pernah', inline: true },
      )
      .addFields({
        name: '🎁 Benefit Kamu',
        value: [
          '💰 Daily reward 2x lebih banyak',
          '🎣 Cooldown fishing 15 detik',
          '🎁 Weekly rare loot box gratis',
          '⭐ XP multiplier 1.5x',
          '💸 Akses `/gift` transfer koin',
          '🚀 Akses `/game crash`',
          '📊 Akses `/history`',
          '🏅 Badge & tag [PREMIUM]',
        ].join('\n')
      })
      .setColor(0xFFD700)
      .setTimestamp()

    return interaction.reply({ embeds: [embed] })
  }

  if (sub === 'status') {
    const { data } = await supabase
      .from('levels')
      .select('is_premium, premium_expires_at')
      .eq('user_id', user.id)
      .single()

    if (!data) return interaction.reply({ content: '❌ Kamu belum punya akun!', flags: 64 })

    // Cek apakah premium masih aktif
    let isPremiumActive = false
    if (data.is_premium) {
      if (!data.premium_expires_at) {
        isPremiumActive = true // permanent
      } else {
        isPremiumActive = new Date(data.premium_expires_at) > new Date()
      }
    }

    // Kalau expired, update status
    if (data.is_premium && !isPremiumActive) {
      await supabase
        .from('levels')
        .update({ is_premium: false, premium_expires_at: null })
        .eq('user_id', user.id)
    }

    const embed = new EmbedBuilder()
      .setTitle(`⭐ Status Premium ${user.username}`)
      .addFields(
        {
          name: '⭐ Status',
          value: isPremiumActive ? '✅ PREMIUM AKTIF' : '❌ Bukan Premium',
          inline: true
        },
        {
          name: '📅 Berakhir',
          value: isPremiumActive
            ? data.premium_expires_at
              ? new Date(data.premium_expires_at).toLocaleDateString('id-ID')
              : 'Permanent'
            : '-',
          inline: true
        },
      )
      .setColor(isPremiumActive ? 0xFFD700 : 0x95a5a6)
      .setTimestamp()

    if (!isPremiumActive) {
      embed.setDescription('Kamu belum premium! Hubungi admin untuk mendapatkan key.')
    }

    return interaction.reply({ embeds: [embed] })
  }
}

// Helper: cek apakah user premium
export async function isPremium(userId) {
  try {
    const { data } = await supabase
      .from('levels')
      .select('is_premium, premium_expires_at')
      .eq('user_id', userId)
      .single()

    if (!data?.is_premium) return false
    if (!data.premium_expires_at) return true // permanent
    return new Date(data.premium_expires_at) > new Date()
  } catch {
    return false
  }
}