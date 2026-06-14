import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import supabase from '../../database/supabase.js'

// Command /deposit
export const depositData = new SlashCommandBuilder()
  .setName('deposit')
  .setDescription('Simpan koin ke bank')
  .addIntegerOption(option =>
    option.setName('jumlah')
      .setDescription('Jumlah koin yang mau disimpan')
      .setRequired(true)
  )

export async function handleDeposit(interaction) {
  const user = interaction.user
  const jumlah = interaction.options.getInteger('jumlah')

  if (jumlah <= 0) {
    return interaction.reply({ content: '❌ Jumlah harus lebih dari 0!', flags: 64 })
  }

  const { data } = await supabase
    .from('levels')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!data) {
    return interaction.reply({ content: '❌ Kamu belum punya akun!', flags: 64 })
  }

  if ((data.coins || 0) < jumlah) {
    return interaction.reply({ content: `❌ Koin wallet kamu tidak cukup! Kamu punya **${data.coins || 0} koin**.`, flags: 64 })
  }

  const newCoins = (data.coins || 0) - jumlah
  const newBank = (data.bank || 0) + jumlah

  await supabase
    .from('levels')
    .update({ coins: newCoins, bank: newBank })
    .eq('user_id', user.id)

  const embed = new EmbedBuilder()
    .setTitle('🏦 Deposit Berhasil!')
    .addFields(
      { name: '💰 Disimpan', value: `${jumlah} koin`, inline: true },
      { name: '💳 Sisa Wallet', value: `${newCoins} koin`, inline: true },
      { name: '🏦 Total Bank', value: `${newBank} koin`, inline: true },
    )
    .setColor(0x57F287)
    .setTimestamp()

  interaction.reply({ embeds: [embed] })
}

// Command /withdraw
export const withdrawData = new SlashCommandBuilder()
  .setName('withdraw')
  .setDescription('Tarik koin dari bank')
  .addIntegerOption(option =>
    option.setName('jumlah')
      .setDescription('Jumlah koin yang mau ditarik')
      .setRequired(true)
  )

export async function handleWithdraw(interaction) {
  const user = interaction.user
  const jumlah = interaction.options.getInteger('jumlah')

  if (jumlah <= 0) {
    return interaction.reply({ content: '❌ Jumlah harus lebih dari 0!', flags: 64 })
  }

  const { data } = await supabase
    .from('levels')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!data) {
    return interaction.reply({ content: '❌ Kamu belum punya akun!', flags: 64 })
  }

  if ((data.bank || 0) < jumlah) {
    return interaction.reply({ content: `❌ Saldo bank kamu tidak cukup! Kamu punya **${data.bank || 0} koin** di bank.`, flags: 64 })
  }

  const newBank = (data.bank || 0) - jumlah
  const newCoins = (data.coins || 0) + jumlah

  await supabase
    .from('levels')
    .update({ coins: newCoins, bank: newBank })
    .eq('user_id', user.id)

  const embed = new EmbedBuilder()
    .setTitle('🏦 Withdraw Berhasil!')
    .addFields(
      { name: '💰 Ditarik', value: `${jumlah} koin`, inline: true },
      { name: '💳 Total Wallet', value: `${newCoins} koin`, inline: true },
      { name: '🏦 Sisa Bank', value: `${newBank} koin`, inline: true },
    )
    .setColor(0x5865F2)
    .setTimestamp()

  interaction.reply({ embeds: [embed] })
}

// Fungsi bunga mingguan (dipanggil dari index.js)
export async function giveWeeklyInterest(client) {
  const { data: members } = await supabase
    .from('levels')
    .select('*')
    .gt('bank', 0)

  if (!members || members.length === 0) return

  for (const member of members) {
    const interest = Math.floor((member.bank || 0) * 0.02)
    if (interest <= 0) continue

    const newBank = (member.bank || 0) + interest

    await supabase
      .from('levels')
      .update({ bank: newBank })
      .eq('user_id', member.user_id)
  }

  console.log('✅ Bunga mingguan telah dibagikan!')
}