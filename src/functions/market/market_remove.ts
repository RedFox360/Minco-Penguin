import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";

export default async function run({
	interaction,
	profileInServer,
	updateProfileInServer,
}: CommandData) {
	const itemName = interaction.options.getString("item_name");
	if (!profileInServer.market.find((i) => i.name === itemName)) {
		await interaction.reply({
			content: "You don't have this item! (remember capitalization)",
			ephemeral: true,
		});
		return;
	}

	updateProfileInServer({ $pull: { market: { name: itemName } } });

	await interaction.reply({
		embeds: [accepted(`**${itemName} ** has been removed from your market.`)],
	});
}
function accepted(text: string) {
	return new MessageEmbed()
		.setDescription(`<:check_circle:872594799662858270> ${text}`)
		.setColor("#B8FF8B");
}
