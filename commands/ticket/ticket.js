import { 
  SlashCommandBuilder, 
  ChannelType, 
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageFlags
} from 'discord.js'
import supabase from '../../database/supabase.js'

export const data = new SlashCommandBuilder()
  .setName('ticket')
  .setDescription('Buka ticket bantuan')

export async function sendTicketPanel(channel) {
  const embed = new EmbedBuilder()
    .setTitle('🎫 UMB Esport Support')
    .setDescription('Klik tombol di bawah untuk membuka ticket!')
    .setColor(0x5865F2)

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('open_ticket')
      .setLabel('🎫 Open Ticket')
      .setStyle(ButtonStyle.Primary),
  )

  await channel.send({ embeds: [embed], components: [row] })
}

export async function handleTicket(interaction) {
  // Hapus pengecekan isButton karena sudah dicek di index.js
  await interaction.deferReply({ flags: MessageFlags.Ephemeral })

  const guild = interaction.guild
  const user = interaction.user

  const existing = guild.channels.cache.find(
    c => c.name === `ticket-${user.username.toLowerCase()}`
  )

  if (existing) {
    return interaction.editReply({
      content: `❌ Kamu sudah punya ticket yang aktif: ${existing}`,
    })
  }

  const ticketChannel = await guild.channels.create({
    name: `ticket-${user.username.toLowerCase()}`,
    type: ChannelType.GuildText,
    permissionOverwrites: [
      {
        id: guild.roles.everyone,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
        ],
      },
    ],
  })

  await supabase.from('tickets').insert({
    ticket_id: `ticket-${user.username.toLowerCase()}`,
    user_id: user.id,
    username: user.username,
    category: 'general',
    channel_id: ticketChannel.id,
  })

  const closeRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('🔒 Close Ticket')
      .setStyle(ButtonStyle.Danger)
  )

  const ticketEmbed = new EmbedBuilder()
    .setTitle('🎫 Ticket Dibuka!')
    .setDescription(`Halo ${user}! Tim admin UMB Esport akan segera membantu kamu.\n\nJelaskan keperluanmu di sini.`)
    .setColor(0x57F287)
    .setTimestamp()

  await ticketChannel.send({
    embeds: [ticketEmbed],
    components: [closeRow]
  })

  return interaction.editReply({
    content: `✅ Ticket berhasil dibuat: ${ticketChannel}`,
  })
}

export async function handleCloseTicket(interaction) {
  // Hapus pengecekan isButton karena sudah dicek di index.js
  await interaction.reply({
    content: '🔒 Ticket akan ditutup dalam 5 detik...',
    flags: MessageFlags.Ephemeral
  })

  await supabase
    .from('tickets')
    .update({ status: 'closed' })
    .eq('channel_id', interaction.channelId)

  setTimeout(() => {
    interaction.channel.delete()
  }, 5000)
}
