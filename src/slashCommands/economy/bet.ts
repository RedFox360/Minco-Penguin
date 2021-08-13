import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";

export const data = {
	name: "bet",
	description: "Bet a number of your Minco Dollars!",
	options: [
		{
			name: "amount",
			description: "The amount of MD you want to bet",
			type: "INTEGER",
			required: true,
		},
	],
};

export async function run({
	interaction,
	profile,
	updateProfile,
}: CommandData) {
	let random = Math.floor(Math.random() * 2);
	let amount = interaction.options.getInteger("amount");
	if (amount > profile.mincoDollars) {
		await interaction.reply({
			content: `You don't have ${amount} Minco Dollars in your wallet`,
			ephemeral: true,
		});
		return;
	}
	if (amount <= 0) {
		await interaction.reply({
			content: "You have to bet a positive number of Minco Dollars",
			ephemeral: true,
		});
		return;
	}
	if (amount > 20) {
		await interaction.reply({
			content: "You can't bet more than 20 Minco Dollars",
			ephemeral: true,
		});
		return;
	}

	if (random) {
		await updateProfile({ $inc: { mincoDollars: -amount } });
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setDescription(
						`<:x_circle:872594799553839114> You lost! You lost ${amount} MD`
					)
					.setColor("#E48383"),
			],
		});
	} else {
		await updateProfile({ $inc: { mincoDollars: amount } });
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setDescription(
						`<:check_circle:872594799662858270> You won! You won ${amount} MD`
					)
					.setColor("#B8FF8B"),
			],
		});
	}
}
