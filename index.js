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
import { economyData, handleEconomy } from "./commands/currency/currency.js";
import {
  bankData,
  handleBank,
  giveWeeklyInterest,
} from "./commands/bank/bank.js";
import {
  gameData,
  handleGame,
  handleBlackjackButton,
  handleCrashButton,
} from "./commands/games/games.js";
import { profileData, handleProfile } from "./commands/profile/profile.js";
import { statsData, handleStats } from "./commands/stats/stats.js";
import { lootboxData, handleLootbox } from "./commands/lootbox/lootbox.js";
import {
  inventoryData,
  handleInventory,
} from "./commands/inventory/inventory.js";
import { fishingData, handleFishing } from "./commands/fishing/fishing.js";
import { shopData, handleShop } from "./commands/shop/shop.js";
import { equipData, handleEquip } from "./commands/equip/equip.js";
import { helpData, handleHelp } from "./commands/help/help.js";
import { roastData, handleRoast } from "./commands/roast/roast.js";
import { eventData, handleEvent } from "./commands/event/event.js";
import { startServer } from "./server.js";
import { boostData, handleBoost } from "./commands/boost/boost.js";

import { giftData, handleGift } from "./commands/gift/gift.js";
import { historyData, handleHistory } from "./commands/history/history.js";
import {
  premiumData,
  handlePremium,
  giveWeeklyPremiumLootbox,
  checkExpiringPremium,
} from "./commands/premium/premium.js";

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
  lootboxData.toJSON(),
  inventoryData.toJSON(),
  fishingData.toJSON(),
  shopData.toJSON(),
  equipData.toJSON(),
  helpData.toJSON(),
  roastData.toJSON(),
  eventData.toJSON(),
  boostData.toJSON(),
  premiumData.toJSON(),
  giftData.toJSON(),
  historyData.toJSON(),
];

// Helper: register commands ke 1 guild
async function registerCommandsToGuild(guildId) {
  try {
    await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), {
      body: commands,
    });
    console.log(`✅ Commands registered to guild: ${guildId}`);
  } catch (error) {
    console.error(`❌ Failed to register commands to guild ${guildId}:`, error);
  }
}

client.once("clientReady", async () => {
  console.log(`✅ Bot ${client.user.tag} siap!`);

  // Register commands ke semua guild yang bot udah ada sekarang
  for (const guild of client.guilds.cache.values()) {
    await registerCommandsToGuild(guild.id);
  }

  setInterval(async () => {
    const now = new Date();
    if (now.getDay() === 1 && now.getHours() === 8 && now.getMinutes() === 0) {
      await giveWeeklyInterest(client);
      await giveWeeklyPremiumLootbox();
    }
    if (now.getHours() === 9 && now.getMinutes() === 0) {
      await checkExpiringPremium(client);
    }
  }, 60 * 1000);
});

// Auto-register commands saat bot di-invite ke server baru
client.on("guildCreate", async (guild) => {
  console.log(`🆕 Bot joined new guild: ${guild.name} (${guild.id})`);
  await registerCommandsToGuild(guild.id);
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
      if (interaction.commandName === "economy")
        await handleEconomy(interaction);
      if (interaction.commandName === "bank") await handleBank(interaction);
      if (interaction.commandName === "game") await handleGame(interaction);
      if (interaction.commandName === "profile")
        await handleProfile(interaction);
      if (interaction.commandName === "stats") await handleStats(interaction);
      if (interaction.commandName === "lootbox")
        await handleLootbox(interaction);
      if (interaction.commandName === "inventory")
        await handleInventory(interaction);
      if (interaction.commandName === "fish") await handleFishing(interaction);
      if (interaction.commandName === "shop") await handleShop(interaction);
      if (interaction.commandName === "equip") await handleEquip(interaction);
      if (interaction.commandName === "help") await handleHelp(interaction);
      if (interaction.commandName === "roast") await handleRoast(interaction);
      if (interaction.commandName === "event") await handleEvent(interaction);
      if (interaction.commandName === "boost") await handleBoost(interaction);
      if (interaction.commandName === "premium")
        await handlePremium(interaction);
      if (interaction.commandName === "gift") await handleGift(interaction);
      if (interaction.commandName === "history")
        await handleHistory(interaction);
    }

    if (interaction.isButton()) {
      if (interaction.customId === "open_ticket")
        await handleTicket(interaction);
      if (interaction.customId === "close_ticket")
        await handleCloseTicket(interaction);
      if (
        interaction.customId === "bj_hit" ||
        interaction.customId === "bj_stand"
      )
        await handleBlackjackButton(interaction);
      if (
        interaction.customId === "crash_cashout" ||
        interaction.customId === "crash_lanjut"
      )
        await handleCrashButton(interaction);
    }
  } catch (error) {
    console.error("Interaction error:", error);
  }
});

// Start Express server
startServer(client, 3000);

client.login(process.env.DISCORD_TOKEN);
