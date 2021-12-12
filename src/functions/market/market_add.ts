import { MessageEmbed } from "discord.js";
import { CommandData } from "../../types";
export default async function run({
	interaction,
	profileInServer,
	updateProfileInServer,
}: CommandData) {
	const { market } = profileInServer;
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

	await updateProfileInServer({
		$push: { market: { name: itemName, desc, price } },
	});
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
