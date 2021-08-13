import { CommandData } from "../../types";
export const data = {
	name: "deposit",
	description: "Deposit money into your bank",
	options: [
		{
			name: "amount",
			description: "The amount of MD to deposit",
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
