import { Client, GatewayIntentBits, REST, Routes } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

import { data as ticketData, sendTicketPanel, handleTicket, handleCloseTicket } from './commands/ticket/ticket.js'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
})

// Register slash commands
const rest = new REST().setToken(process.env.DISCORD_TOKEN)

const commands = [ticketData.toJSON()]

client.once('clientReady', async () => {
  console.log(`✅ Bot ${client.user.tag} siap!`)

  try {
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
      { body: commands }
    )
    console.log('✅ Slash commands berhasil didaftarkan!')
  } catch (error) {
    console.error(error)
  }
})

// Handle interactions
client.on('interactionCreate', async interaction => {
  // Handle slash command /ticket
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'ticket') {
      await sendTicketPanel(interaction.channel)
      await interaction.reply({ content: '✅ Panel ticket berhasil dibuat!', ephemeral: true })
    }
  }

  // Handle buttons
  if (interaction.isButton()) {
    if (interaction.customId === 'open_ticket') await handleTicket(interaction)
    if (interaction.customId === 'close_ticket') await handleCloseTicket(interaction)
  }
})

client.login(process.env.DISCORD_TOKEN)