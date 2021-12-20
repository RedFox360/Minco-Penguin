import { CommandData } from "../../types";
import {
	MessageActionRow,
	MessageSelectMenu,
	MessageComponentInteraction,
} from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import shop from "../../json/gemShop.json";
import ms from "ms";

export function subcommand() {
	return new SlashCommandSubcommandBuilder()
		.setName("gem")
		.setDescription("Buy gems from the shop!");
}

export async function run({
	interaction,
	profileOf,
	updateProfile,
}: CommandData) {
	const row = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("gems-select")
			.setPlaceholder("Minco Gems")
			.addOptions(shop)
	);
	const prices = [
		500, 750, 750, 500, 750, 750, 400, 1500, 400, 400, 400, 300, 1250, 400, 500,
		400,
	];
	const msg = await interaction.reply({
		content: "Choose a gem from the Minco Shop",
		components: [row],
		fetchReply: true,
	});

	const collector = msg.createMessageComponentCollector({
		time: ms("2h"),
		max: 10,
	});

	collector.on("collect", async (i: MessageComponentInteraction) => {
		if (!i.isMessageComponent()) return;
		await i.deferUpdate();
		const profile = await profileOf(i.user.id);
		const value = (i as any).values[0];
		if (profile.gems.includes(value)) {
			await i.followUp({
				content: "You already have this item!",
				ephemeral: true,
			});
			return;
		}
		const price = prices[parseInt(value) - 1];
		console.log(price);
		if (profile.mincoDollars < price) {
			await interaction.followUp({
				content: "You don't have enough Minco Dollars to buy this item!",
				ephemeral: true,
			});
			return;
		}

		await updateProfile({ $push: { gems: value } }, i.user.id);
		await updateProfile({ $inc: { mincoDollars: -price } }, i.user.id);
		let item = shop.find((i) => i.value == value);
		await i.followUp(
			`${i.user.toString()}, you succesfully bought a(n) ${item.emoji} **${
				item.label
			}** for ${price} MD`
		);
	});
}