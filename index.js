import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  MessageFlags,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

import {
  data as ticketData,
  sendTicketPanel,
  handleTicket,
  handleCloseTicket,
} from "./commands/ticket/ticket.js";
import {
  rankData,
  leaderboardData,
  handleXP,
  handleRank,
  handleLeaderboard,
} from "./commands/leveling/leveling.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// Register slash commands
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

const commands = [
  ticketData.toJSON(),
  rankData.toJSON(),
  leaderboardData.toJSON(),
];

client.once("clientReady", async () => {
  console.log(`✅ Bot ${client.user.tag} siap!`);

  try {
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
      { body: commands },
    );
    console.log("✅ Slash commands berhasil didaftarkan!");
  } catch (error) {
    console.error(error);
  }
});

// Handle pesan masuk (XP system)
client.on("messageCreate", async (message) => {
  await handleXP(message);
});

// Handle interactions
client.on("interactionCreate", async (interaction) => {
  // Handle slash commands
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "ticket") {
      await interaction.reply({
        content: "✅ Panel ticket berhasil dibuat!",
        flags: MessageFlags.Ephemeral,
      });
      await sendTicketPanel(interaction.channel);
    }
    if (interaction.commandName === "rank") await handleRank(interaction);
    if (interaction.commandName === "leaderboard")
      await handleLeaderboard(interaction);
  }

  // Handle buttons
  if (interaction.isButton()) {
    if (interaction.customId === "open_ticket") await handleTicket(interaction);
    if (interaction.customId === "close_ticket")
      await handleCloseTicket(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);