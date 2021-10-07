import { MessageEmbed } from "discord.js";
import { CommandData } from "../types";

export default async function run({
	interaction,
	profileInServerOf,
	updateProfile,
}: CommandData) {
	const user = interaction.options.getUser("user");
	const { market } = await profileInServerOf(user.id);
	if (!market.length) {
		await interaction.reply({
			content: `${user.toString()} doesn't have anything in their market`,
		});
		return;
	}
	market.sort((a, b) => b.price - a.price);
	await updateProfile({ market }, user.id);
	const marketEmbed = new MessageEmbed()
		.setColor("#D1F2EB")
		.setTitle("Market")
		.setDescription(`User: ${user.toString()}`)
		.setFooter(interaction.guild?.name ?? interaction.user.username);
	for (const { name, price, desc } of market) {
		let value = `Price: ${price} MD`;
		if (desc) value += `\n${desc}`;
		marketEmbed.addField(name, value);
	}
	await interaction.reply({ embeds: [marketEmbed] });
}
