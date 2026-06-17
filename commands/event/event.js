import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import supabase from '../../database/supabase.js'

const EVENT_LABELS = {
  double_xp: { name: 'Double XP', emoji: '🎉', desc: 'XP dari chat berlipat ganda!' },
  double_coins: { name: 'Double Coins', emoji: '💰', desc: 'Koin dari daily & games berlipat ganda!' },
  fishing_frenzy: { name: 'Fishing Frenzy', emoji: '🎣', desc: 'Cooldown fishing cuma 10 detik!' },
  loot_rain: { name: 'Loot Rain', emoji: '🎁', desc: 'Semua member dapat loot box gratis!' },
}

export const eventData = new SlashCommandBuilder()
  .setName('event')
  .setDescription('Lihat event yang sedang berlangsung')
  .addSubcommand(sub =>
    sub.setName('info')
      .setDescription('Lihat event aktif sekarang')
  )

export async function handleEvent(interaction) {
  const sub = interaction.options.getSubcommand()

  if (sub === 'info') {
    try {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .gte('ends_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!data) {
        return interaction.reply({
          content: '😴 Tidak ada event yang sedang berlangsung.',
          flags: 64
        })
      }

      const event = EVENT_LABELS[data.event_type]
      const endsAt = new Date(data.ends_at)
      const now = new Date()
      const diffMs = endsAt - now
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

      const embed = new EmbedBuilder()
        .setTitle(`${event.emoji} Event Aktif: ${event.name}`)
        .setDescription(event.desc)
        .addFields(
          { name: '⏰ Berakhir dalam', value: `${diffHours} jam ${diffMinutes} menit`, inline: true },
          { name: '📊 Multiplier', value: `${data.multiplier}x`, inline: true },
        )
        .setColor(0xFFD700)
        .setTimestamp()

      return interaction.reply({ embeds: [embed] })
    } catch {
      return interaction.reply({
        content: '😴 Tidak ada event yang sedang berlangsung.',
        flags: 64
      })
    }
  }
}