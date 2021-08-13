import { MessageEmbed } from "discord.js";
import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("market_add")
	.setDescription("Add an item to your market")
	.addIntegerOption((option) =>
		option
			.setName("price")
			.setDescription("The price of the item")
			.setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName("item_name")
			.setDescription("The name of your item")
			.setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName("description")
			.setDescription("A description of your item")
			.setRequired(false)
	);

export async function run({
	interaction,
	profile,
	updateProfile,
}: CommandData) {
	const { market } = profile;
	const price = interaction.options.getInteger("price");
	const itemName = interaction.options.getString("item_name");
	const desc = interaction.options.getString("description");

	for (const m of market) {
		if (itemName.toLowerCase() === m.name.toLowerCase()) {
			await interaction.reply({
				content: "You already have this item in your market!",
				ephemeral: true,
			});
			return;
		}
	}

	await updateProfile({ $push: { market: { name: itemName, desc, price } } });
	if (desc) {
		await interaction.reply({
			embeds: [
				accepted(
					`**${itemName}** | ${desc} for ${price} MD has been added to your market.`
				),
			],
		});
	} else {
		await interaction.reply({
			embeds: [
				accepted(
					`**${itemName}** for ${price} MD has been added to your market.`
				),
			],
		});
	}
}

function accepted(text: string) {
	return new MessageEmbed()
		.setDescription(`<:check_circle:872594799662858270> ${text}`)
		.setColor("#B8FF8B");
}
