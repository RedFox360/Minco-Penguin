import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("bet")
	.setDescription("Bet a number of your Minco Dollars!")
	.addIntegerOption((option) =>
		option
			.setName("amount")
			.setDescription("The amount of MD you want to bet")
			.setRequired(true)
	);

export async function run({
	interaction,
	profile,
	updateProfile,
}: CommandData) {
	let random = Math.round(Math.random());
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
		await interaction.reply(
			`<:x_circle:872594799553839114> You lost! You lost ${amount} MD`
		);
	} else {
		await updateProfile({ $inc: { mincoDollars: amount } });
		await interaction.reply(
			`<:check_circle:872594799662858270> You won! You won ${amount} MD`
		);
	}
}
