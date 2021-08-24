import { CommandData } from "../../types";
import { MessageActionRow, MessageSelectMenu, GuildMember } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import shop from "../../json/shop.json";
import ms from "ms";
export const data = new SlashCommandBuilder()
	.setName("buy")
	.setDescription("Buy items from the shop!");

export async function run({
	interaction,
	profile,
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

	const filter = (i: GuildMember) => i.user.id === interaction.user.id;

	const collector = (msg as any).createMessageComponentCollector({
		filter,
		time: ms("2h"),
		max: 3,
	});

	collector.on("collect", async (i) => {
		await i.deferUpdate();
		const value = i.values;
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
		await updateProfile({
			$push: { inventory: value },
		});
		await updateProfile({
			$inc: { mincoDollars: -price },
		});
		let name;
		for (const item of shop) {
			if (item.value == value) {
				name = item.label;
				break;
			}
		}
		await i.followUp(`You succesfully bought a(n) **${name}**`);
	});
}
