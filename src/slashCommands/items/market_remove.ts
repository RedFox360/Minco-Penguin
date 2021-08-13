import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";

export const data = {
	name: "market_remove",
	description: "Remove an item from your market",
	options: [
		{
			name: "item_name",
			description: "The name of the item you want to remove",
			type: "STRING",
			required: true,
		},
	],
};

export async function run({
	interaction,
	profile,
	updateProfile,
}: CommandData) {
	const itemName = interaction.options.getString("item_name");
	if (!profile.market.find((i) => i.name === itemName)) {
		await interaction.reply({
			content: "You don't have this item! (remember capitalization)",
			ephemeral: true,
		});
		return;
	}

	updateProfile({ $pull: { market: { name: itemName } } });

	await interaction.reply({
		embeds: [accepted(`**${itemName} ** has been removed from your market.`)],
	});
}
function accepted(text: string) {
	return new MessageEmbed()
		.setDescription(`<:check_circle:872594799662858270> ${text}`)
		.setColor("#B8FF8B");
}
