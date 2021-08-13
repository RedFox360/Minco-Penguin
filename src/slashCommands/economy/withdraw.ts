import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("withdraw")
	.setDescription("Withdraw money from your bank")
	.addIntegerOption((option) =>
		option
			.setName("amount")
			.setDescription("The amount of MD to withdraw")
			.setRequired(true)
	);

export async function run({
	interaction,
	profile,
	updateProfile,
}: CommandData) {
	const amount = interaction.options.getInteger("amount");
	if (amount <= 0) {
		await interaction.reply({
			content: "Withdrawal amount must be a positive number",
			ephemeral: true,
		});
		return;
	}
	if (amount > profile.bank) {
		await interaction.reply({
			content: "You don't have that amount of Minco Dollars to withdraw",
			ephemeral: true,
		});
		return;
	}
	await updateProfile({ $inc: { mincoDollars: amount, bank: -amount } });
	await interaction.reply(`You withdrawed ${amount} Minco Dollars from bank`);
}
