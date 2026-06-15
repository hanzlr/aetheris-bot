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
  levelData,
  handleXP,
  handleLevel,
} from "./commands/leveling/leveling.js";
import {
  economyData,
  handleEconomy,
} from "./commands/currency/currency.js";
import {
  bankData,
  handleBank,
  giveWeeklyInterest,
} from "./commands/bank/bank.js";
import {
  gameData,
  handleGame,
  handleBlackjackButton,
} from "./commands/games/games.js";
import {
  profileData,
  handleProfile,
} from "./commands/profile/profile.js";
import {
  statsData,
  handleStats,
} from "./commands/stats/stats.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

const commands = [
  ticketData.toJSON(),
  levelData.toJSON(),
  economyData.toJSON(),
  bankData.toJSON(),
  gameData.toJSON(),
  profileData.toJSON(),
  statsData.toJSON(),
];

client.once("clientReady", async () => {
  console.log(`✅ Bot ${client.user.tag} siap!`);
  try {
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
      { body: commands }
    );
    console.log("✅ Slash commands berhasil didaftarkan!");
  } catch (error) {
    console.error(error);
  }

  setInterval(async () => {
    const now = new Date();
    if (now.getDay() === 1 && now.getHours() === 8 && now.getMinutes() === 0) {
      await giveWeeklyInterest(client);
    }
  }, 60 * 1000);
});

client.on("messageCreate", async (message) => {
  await handleXP(message);
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "ticket") {
        await interaction.reply({
          content: "✅ Panel ticket berhasil dibuat!",
          flags: MessageFlags.Ephemeral,
        });
        await sendTicketPanel(interaction.channel);
      }
      if (interaction.commandName === "level") await handleLevel(interaction);
      if (interaction.commandName === "economy") await handleEconomy(interaction);
      if (interaction.commandName === "bank") await handleBank(interaction);
      if (interaction.commandName === "game") await handleGame(interaction);
      if (interaction.commandName === "profile") await handleProfile(interaction);
      if (interaction.commandName === "stats") await handleStats(interaction);
    }

    if (interaction.isButton()) {
      if (interaction.customId === "open_ticket") await handleTicket(interaction);
      if (interaction.customId === "close_ticket") await handleCloseTicket(interaction);
      if (interaction.customId === "bj_hit" || interaction.customId === "bj_stand") await handleBlackjackButton(interaction);
    }
  } catch (error) {
    console.error("Interaction error:", error);
  }
});

client.login(process.env.DISCORD_TOKEN);