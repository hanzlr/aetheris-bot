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

// Command /ticket
export const data = new SlashCommandBuilder()
  .setName('ticket')
  .setDescription('Buka ticket bantuan')

// Kirim panel ticket
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

// Handle button & ticket logic
export async function handleTicket(interaction) {
  if (!interaction.isButton()) return
  if (interaction.customId !== 'open_ticket') return

  await interaction.deferReply({ flags: MessageFlags.Ephemeral })

  const guild = interaction.guild
  const user = interaction.user

  // Cek apakah user sudah punya ticket open
  const existing = guild.channels.cache.find(
    c => c.name === `ticket-${user.username.toLowerCase()}`
  )

  if (existing) {
    return interaction.editReply({
      content: `❌ Kamu sudah punya ticket yang aktif: ${existing}`,
    })
  }

  // Buat channel private
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

  // Simpan ke Supabase
  await supabase.from('tickets').insert({
    ticket_id: `ticket-${user.username.toLowerCase()}`,
    user_id: user.id,
    username: user.username,
    category: 'general',
    channel_id: ticketChannel.id,
  })

  // Kirim pesan di ticket channel
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

// Handle close ticket
export async function handleCloseTicket(interaction) {
  if (!interaction.isButton()) return
  if (interaction.customId !== 'close_ticket') return

  await interaction.reply({
    content: '🔒 Ticket akan ditutup dalam 5 detik...',
    flags: MessageFlags.Ephemeral
  })

  // Update status di Supabase
  await supabase
    .from('tickets')
    .update({ status: 'closed' })
    .eq('channel_id', interaction.channelId)

  setTimeout(() => {
    interaction.channel.delete()
  }, 5000)
}
