import { MessageEmbed } from "discord.js";
import { CommandData } from "../../types";

export const data = {
	name: "market_add",
	description: "Add an item to your market",
	options: [
		{
			name: "price",
			description: "The price of the item",
			type: "INTEGER",
			required: true,
		},
		{
			name: "item_name",
			description: "The name of your item",
			type: "STRING",
			required: true,
		},
		{
			name: "description",
			description: "A description of your item",
			type: "STRING",
			required: false,
		},
	],
};

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
