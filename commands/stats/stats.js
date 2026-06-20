import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import supabase from '../../database/supabase.js'

export const statsData = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('Lihat statistik')
  .addSubcommand(sub =>
    sub.setName('view')
      .setDescription('Lihat statistik kamu atau member lain')
      .addUserOption(option =>
        option.setName('user')
          .setDescription('Member yang mau dilihat (opsional)')
          .setRequired(false)
      )
  )
  .addSubcommand(sub =>
    sub.setName('server')
      .setDescription('Lihat statistik server')
  )

export async function handleStats(interaction) {
  const sub = interaction.options.getSubcommand()

  if (sub === 'view') {
    const target = interaction.options.getUser('user') || interaction.user

    // Ambil data level
    const { data: userData } = await supabase
      .from('levels')
      .select('*')
      .eq('user_id', target.id)
      .single()

    if (!userData) return interaction.reply({ content: '❌ User ini belum punya akun!', flags: 64 })

    // Ambil statistik games
    const { data: gameData } = await supabase
      .from('game_stats')
      .select('*')
      .eq('user_id', target.id)

    // Hitung stats per game
    const gameTypes = ['dice', 'coinflip', 'slot', 'blackjack']
    const gameStats = {}

    gameTypes.forEach(type => {
      const games = gameData?.filter(g => g.game_type === type) || []
      gameStats[type] = {
        total: games.length,
        wins: games.filter(g => g.result === 'win').length,
        losses: games.filter(g => g.result === 'loss').length,
        draws: games.filter(g => g.result === 'draw').length,
      }
    })

    // Hitung ekonomi
    const totalEarned = gameData?.filter(g => g.coins_change > 0).reduce((sum, g) => sum + g.coins_change, 0) || 0
    const totalSpent = gameData?.filter(g => g.coins_change < 0).reduce((sum, g) => sum + Math.abs(g.coins_change), 0) || 0
    const netProfit = totalEarned - totalSpent

    const embed = new EmbedBuilder()
      .setTitle(`📊 Statistik ${target.username}`)
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        // Games
        {
          name: '🎮 Games',
          value: [
            `🎲 Dice → Main: ${gameStats.dice.total}x | Menang: ${gameStats.dice.wins}x | Kalah: ${gameStats.dice.losses}x`,
            `🪙 Coinflip → Main: ${gameStats.coinflip.total}x | Menang: ${gameStats.coinflip.wins}x | Kalah: ${gameStats.coinflip.losses}x`,
            `🎰 Slot → Main: ${gameStats.slot.total}x | Menang: ${gameStats.slot.wins}x | Kalah: ${gameStats.slot.losses}x`,
            `🃏 Blackjack → Main: ${gameStats.blackjack.total}x | Menang: ${gameStats.blackjack.wins}x | Kalah: ${gameStats.blackjack.losses}x`,
          ].join('\n'),
          inline: false
        },
        // Ekonomi
        {
          name: '💰 Ekonomi',
          value: [
            `💳 Total koin didapat: ${totalEarned.toLocaleString()}`,
            `💸 Total koin dihabiskan: ${totalSpent.toLocaleString()}`,
            `📈 Net profit: ${netProfit >= 0 ? '+' : ''}${netProfit.toLocaleString()}`,
          ].join('\n'),
          inline: false
        },
        // Aktivitas
        {
          name: '📈 Aktivitas',
          value: [
            `💬 Total pesan: ${userData.total_messages}`,
            `⭐ Level: ${userData.level}`,
            `💳 Wallet: ${(userData.coins || 0).toLocaleString()} koin`,
            `🏦 Bank: ${(userData.bank || 0).toLocaleString()} koin`,
          ].join('\n'),
          inline: false
        },
      )
      .setColor(0x5865F2)
      .setTimestamp()

    interaction.reply({ embeds: [embed] })
  }

  if (sub === 'server') {
    // Total member
    const { count: totalMembers } = await supabase
      .from('levels')
      .select('*', { count: 'exact', head: true })

    // Member teraktif
    const { data: topMember } = await supabase
      .from('levels')
      .select('username, total_messages')
      .order('total_messages', { ascending: false })
      .limit(1)
      .single()

    // Total koin beredar
    const { data: allUsers } = await supabase
      .from('levels')
      .select('coins, bank')

    const totalCoins = allUsers?.reduce((sum, u) => sum + (u.coins || 0) + (u.bank || 0), 0) || 0

    // Total game dimainkan
    const { count: totalGames } = await supabase
      .from('game_stats')
      .select('*', { count: 'exact', head: true })

    const embed = new EmbedBuilder()
      .setTitle('📊 Statistik Aetheris Server')
      .addFields(
        { name: '👥 Total Member', value: `${totalMembers || 0} member`, inline: true },
        { name: '🏆 Member Teraktif', value: topMember ? `${topMember.username} (${topMember.total_messages} pesan)` : 'Belum ada', inline: true },
        { name: '💰 Total Koin Beredar', value: `${totalCoins.toLocaleString()} koin`, inline: true },
        { name: '🎮 Total Game Dimainkan', value: `${totalGames || 0}x`, inline: true },
      )
      .setColor(0xFFD700)
      .setTimestamp()

    interaction.reply({ embeds: [embed] })
  }
}