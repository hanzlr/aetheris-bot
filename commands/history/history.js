import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import supabase from '../../database/supabase.js'
import { isPremium } from '../premium/premium.js'

export const historyData = new SlashCommandBuilder()
  .setName('history')
  .setDescription('Lihat riwayat transaksi koin kamu (Premium only)')
  .addIntegerOption(option =>
    option.setName('limit')
      .setDescription('Jumlah transaksi yang ditampilkan (default: 10)')
      .setRequired(false)
  )

export async function handleHistory(interaction) {
  const user = interaction.user
  const limit = interaction.options.getInteger('limit') || 10

  // Cek premium
  const userIsPremium = await isPremium(user.id)
  if (!userIsPremium) {
    return interaction.reply({
      content: '❌ Fitur ini khusus untuk member **⭐ PREMIUM**! Hubungi admin untuk mendapatkan key.',
      flags: 64
    })
  }

  // Ambil riwayat transaksi
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (!transactions || transactions.length === 0) {
    return interaction.reply({
      content: '❌ Belum ada riwayat transaksi!',
      flags: 64
    })
  }

  const transactionList = transactions.map(t => {
    const date = new Date(t.created_at).toLocaleDateString('id-ID')
    const time = new Date(t.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    const sign = t.amount > 0 ? '+' : ''
    const emoji = t.amount > 0 ? '💰' : '💸'
    return `${emoji} \`${date} ${time}\` — ${t.description} **${sign}${t.amount.toLocaleString()} koin**`
  }).join('\n')

  const embed = new EmbedBuilder()
    .setTitle(`📊 Riwayat Transaksi ${user.username}`)
    .setDescription(transactionList)
    .setColor(0x5865F2)
    .setFooter({ text: `Menampilkan ${transactions.length} transaksi terakhir` })
    .setTimestamp()

  return interaction.reply({ embeds: [embed] })
}

// Helper: catat transaksi
export async function logTransaction(userId, amount, description) {
  try {
    await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: amount > 0 ? 'income' : 'expense',
        amount,
        description,
      })
  } catch (error) {
    console.error('Error logging transaction:', error)
  }
}