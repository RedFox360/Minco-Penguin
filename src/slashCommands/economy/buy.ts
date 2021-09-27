import { CommandData } from "../../types";
import {
	MessageActionRow,
	MessageSelectMenu,
	GuildMember,
	MessageComponentInteraction,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import shop from "../../json/shop.json";
import ms from "ms";
export const data = new SlashCommandBuilder()
	.setName("buy")
	.setDescription("Buy items from the shop!");

export async function run({
	interaction,
	profileOf,
	updateProfile,
}: CommandData) {
	const row = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("items-select")
			.setPlaceholder("Minco Shop")
			.addOptions(shop)
	);
	const prices = [75, 900, 25, 4, 10, 75, 400, 50, 50, 50, 8, 10];
	const msg = await interaction.reply({
		content: "Choose an item from the Minco Shop",
		components: [row],
		fetchReply: true,
	});

	const collector = msg.createMessageComponentCollector({
		time: ms("2h"),
		max: 10,
	});

	collector.on("collect", async (i) => {
		await i.deferUpdate();
		const profile = await profileOf(i.user.id);
		const value = (i as any).values[0];
		if (profile.inventory.includes(value)) {
			await i.followUp({
				content: "You already have this item!",
				ephemeral: true,
			});
			return;
		}
		const price = prices[parseInt(value) - 1];
		if (profile.mincoDollars < price) {
			await interaction.followUp({
				content: "You don't have enough Minco Dollars to buy this item!",
				ephemeral: true,
			});
			return;
		}
		await updateProfile(
			{
				$push: { inventory: value },
			},
			i.user.id
		);
		if (value == "05") {
			await updateProfile({ candyAmount: 3 }, i.user.id);
		}
		await updateProfile(
			{
				$inc: { mincoDollars: -price },
			},
			i.user.id
		);
		let item = shop.find((i) => i.value == value);
		await i.followUp(
			`${i.user.toString()}, you succesfully bought a(n) ${item.emoji} **${
				item.label
			}** for ${price} MD`
		);
	});
}
