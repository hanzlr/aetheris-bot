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
import {
  dailyData,
  balanceData,
  handleDaily,
  handleBalance,
} from "./commands/currency/currency.js";
import {
  depositData,
  withdrawData,
  handleDeposit,
  handleWithdraw,
  giveWeeklyInterest,
} from "./commands/bank/bank.js";
import {
  diceData,
  coinflipData,
  slotData,
  blackjackData,
  handleDice,
  handleCoinflip,
  handleSlot,
  handleBlackjack,
} from "./commands/games/games.js";

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
  rankData.toJSON(),
  leaderboardData.toJSON(),
  dailyData.toJSON(),
  balanceData.toJSON(),
  depositData.toJSON(),
  withdrawData.toJSON(),
  diceData.toJSON(),
  coinflipData.toJSON(),
  slotData.toJSON(),
  blackjackData.toJSON(),
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
    const now = new Date()
    if (now.getDay() === 1 && now.getHours() === 8 && now.getMinutes() === 0) {
      await giveWeeklyInterest(client)
    }
  }, 60 * 1000)
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
      if (interaction.commandName === "rank") await handleRank(interaction);
      if (interaction.commandName === "leaderboard") await handleLeaderboard(interaction);
      if (interaction.commandName === "daily") await handleDaily(interaction);
      if (interaction.commandName === "balance") await handleBalance(interaction);
      if (interaction.commandName === "deposit") await handleDeposit(interaction);
      if (interaction.commandName === "withdraw") await handleWithdraw(interaction);
      if (interaction.commandName === "dice") await handleDice(interaction);
      if (interaction.commandName === "coinflip") await handleCoinflip(interaction);
      if (interaction.commandName === "slot") await handleSlot(interaction);
      if (interaction.commandName === "blackjack") await handleBlackjack(interaction);
    }

    if (interaction.isButton()) {
      if (interaction.customId === "open_ticket") await handleTicket(interaction);
      if (interaction.customId === "close_ticket") await handleCloseTicket(interaction);
    }
  } catch (error) {
    console.error('Interaction error:', error)
  }
});

client.login(process.env.DISCORD_TOKEN);