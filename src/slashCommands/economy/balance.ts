import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
export const data = {
	name: "balance",
	description: "View your balance of Minco Dollars!",
	options: [
		{
			name: "user",
			type: "USER",
			description: "The user to view the balance of",
			required: false,
		},
	],
};
export async function run({ interaction, profileOf }: CommandData) {
	const user = interaction.options.getUser("user") ?? interaction.user;
	const profile = await profileOf(user.id);
	const balanceEmbed = new MessageEmbed()
		.setAuthor("Balance", user.avatarURL())
		.setColor("#7BFF70")
		.setDescription(
			`:coin: Wallet: **${profile.mincoDollars.toLocaleString()}** Minco Dollars
:dollar: Bank: **${profile.bank.toLocaleString()}** Minco Dollars`
		);
	await interaction.reply({ embeds: [balanceEmbed] });
}
