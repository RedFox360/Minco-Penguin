import { MessageEmbed } from "discord.js";
import { CommandData } from "../../types";

export const data = {
	name: "market_view",
	description: "View the market of a user",
	options: [
		{
			name: "user",
			description: "The user whose market to view",
			type: "USER",
			required: true,
		},
	],
};

export async function run({
	interaction,
	profileOf,
	updateProfile,
}: CommandData) {
	const user = interaction.options.getUser("user");
	const { market } = await profileOf(user.id);
	if (!market.length) {
		await interaction.reply({
			content: `${user.toString()} doesn't have anything in their market`,
		});
	}
	market.sort((a, b) => b.price - a.price);
	await updateProfile({ market }, user.id);
	const marketEmbed = new MessageEmbed()
		.setColor("#D1F2EB")
		.setTitle("Market")
		.setDescription(`User: ${user.toString()}`)
		.setFooter(interaction.guild.name);
	for (const { name, price, desc } of market) {
		let value = `Price: ${price} MD`;
		if (desc) value += `\n${desc}`;
		marketEmbed.addField(name, value);
	}
	await interaction.reply({ embeds: [marketEmbed] });
}
