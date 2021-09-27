import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
export const data = new SlashCommandBuilder()
	.setName("deposit")
	.setDescription("Deposit money into your bank")
	.addIntegerOption((option) =>
		option
			.setName("amount")
			.setDescription("The amount of MD to deposit")
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
			content: "Deposit amount must be a positive number",
			ephemeral: true,
		});
		return;
	}
	if (amount > profile.mincoDollars) {
		await interaction.reply({
			content: "You don't have that amount of Minco Dollars to deposit",
			ephemeral: true,
		});
		return;
	}
	await updateProfile({ $inc: { mincoDollars: -amount, bank: amount } });
	await interaction.reply(
		`You deposited ${amount} Minco Dollars into your bank`
	);
}
