import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import supabase from "../../database/supabase.js";
import { FISH_LIST } from "../fishing/fishing.js";
import { SHOP_ITEMS } from "../shop/shop.js";
import { PANCING_LIST, UMPAN_LIST } from "../equip/equip.js";
import { isPremium } from "../premium/premium.js";

export const inventoryData = new SlashCommandBuilder()
  .setName("inventory")
  .setDescription("Lihat semua item yang kamu punya")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Member yang mau dilihat (opsional)")
      .setRequired(false),
  );

export async function handleInventory(interaction) {
  const target = interaction.options.getUser("user") || interaction.user;

  const { data: userData } = await supabase
    .from("levels")
    .select("*")
    .eq("user_id", target.id)
    .single();

  if (!userData)
    return interaction.reply({
      content: "❌ User ini belum punya akun!",
      flags: 64,
    });

  // Ambil loot box
  const { data: boxes } = await supabase
    .from("lootboxes")
    .select("*")
    .eq("user_id", target.id)
    .eq("opened", false);

  const common = boxes?.filter((b) => b.box_type === "common").length || 0;
  const rare = boxes?.filter((b) => b.box_type === "rare").length || 0;
  const legendary =
    boxes?.filter((b) => b.box_type === "legendary").length || 0;

  // Ambil ikan
  const { data: fishItems } = await supabase
    .from("fish_inventory")
    .select("*")
    .eq("user_id", target.id)
    .order("fish_id");

  const fishText =
    fishItems && fishItems.length > 0
      ? fishItems
          .map((f) => {
            const fish = FISH_LIST[f.fish_id];
            return `${fish.rarityEmoji} ${fish.emoji} ${fish.name}: ${f.quantity}x`;
          })
          .join("\n")
      : "Belum ada ikan";

  // Ambil item shop
  const { data: shopItems } = await supabase
    .from("shop_inventory")
    .select("*")
    .eq("user_id", target.id);

  const pancingItems =
    shopItems?.filter(
      (i) =>
        SHOP_ITEMS[i.item_id]?.category === "fishing" &&
        i.item_id.startsWith("pancing"),
    ) || [];
  const umpanItems =
    shopItems?.filter(
      (i) =>
        SHOP_ITEMS[i.item_id]?.category === "fishing" &&
        i.item_id.startsWith("umpan"),
    ) || [];
  const boostItems =
    shopItems?.filter((i) => SHOP_ITEMS[i.item_id]?.category === "boost") || [];

  const pancingText =
    pancingItems.length > 0
      ? pancingItems
          .map((i) => {
            const item = SHOP_ITEMS[i.item_id];
            const isEquipped = userData.equipped_pancing === i.item_id;
            return `${item.emoji} ${item.name} x${i.quantity}${isEquipped ? " ✅ **[Equipped]**" : ""}`;
          })
          .join("\n")
      : "🎣 Pancing Bambu (Default)";

  const umpanText =
    umpanItems.length > 0
      ? umpanItems
          .map((i) => {
            const item = SHOP_ITEMS[i.item_id];
            const isEquipped = userData.equipped_umpan === i.item_id;
            return `${item.emoji} ${item.name} x${i.quantity}${isEquipped ? " ✅ **[Equipped]**" : ""}`;
          })
          .join("\n")
      : "🪱 Cacing (Default)";

  const boostText =
    boostItems.length > 0
      ? boostItems
          .map((i) => {
            const item = SHOP_ITEMS[i.item_id];
            return `${item.emoji} ${item.name} x${i.quantity}`;
          })
          .join("\n")
      : "Belum ada boost";

  // Ambil badges
  const { data: badges } = await supabase
    .from("badges")
    .select("badge_id")
    .eq("user_id", target.id);

  const badgeList =
    badges?.length > 0
      ? badges.map((b) => `🏅 ${b.badge_id}`).join("\n")
      : "Belum ada badge";

  const equippedPancing =
    PANCING_LIST[userData.equipped_pancing || "pancing_bambu"];
  const equippedUmpan = UMPAN_LIST[userData.equipped_umpan || "cacing"];

  // Cek premium
  const userIsPremium = await isPremium(target.id);

  const embed = new EmbedBuilder()
    .setTitle(
      `🎒 Inventory ${target.username}${userIsPremium ? " ⭐ [PREMIUM]" : ""}`,
    )
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      {
        name: "💰 Ekonomi",
        value: [
          `💳 Wallet: ${(userData.coins || 0).toLocaleString()} koin`,
          `🏦 Bank: ${(userData.bank || 0).toLocaleString()} koin`,
        ].join("\n"),
        inline: false,
      },
      {
        name: "🎣 Equip Sekarang",
        value: [
          `🎣 Pancing: ${equippedPancing.emoji} ${equippedPancing.name}`,
          `🪱 Umpan: ${equippedUmpan.emoji} ${equippedUmpan.name}`,
        ].join("\n"),
        inline: false,
      },
      {
        name: "🎣 Pancing",
        value: pancingText,
        inline: true,
      },
      {
        name: "🪱 Umpan",
        value: umpanText,
        inline: true,
      },
      {
        name: "⚡ Boost",
        value: boostText,
        inline: false,
      },
      {
        name: "🎁 Loot Box",
        value: [
          `🎁 Common: ${common}x`,
          `💜 Rare: ${rare}x`,
          `🌟 Legendary: ${legendary}x`,
        ].join("\n"),
        inline: false,
      },
      {
        name: "🐟 Ikan",
        value: fishText,
        inline: false,
      },
      {
        name: "🏅 Badges",
        value: badgeList,
        inline: false,
      },
    )
    .setColor(userIsPremium ? 0xffd700 : 0x5865f2)
    .setFooter({ text: "Aetheris • Inventory" })
    .setTimestamp();

  interaction.reply({ embeds: [embed] });
}
