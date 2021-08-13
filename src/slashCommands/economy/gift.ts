import { CommandData } from "../../types";
export const data = {
	name: "gift",
	description: "Gift money to a user!",
	options: [
		{
			name: "user",
			description: "The user to gift money to",
			type: "USER",
			required: true,
		},
		{
			name: "md_amount",
			description: "The amount of money to gift",
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
	const user = interaction.options.getUser("user");
	const amount = interaction.options.getInteger("md_amount");

	if (amount > profile.mincoDollars) {
		await interaction.reply({
			content: `You don't have ${amount} Minco Dollars`,
			ephemeral: true,
		});
		return;
	}
	if (amount <= 0) {
		await interaction.reply({
			content: "You have to gift a positive number of Minco Dollars",
			ephemeral: true,
		});
		return;
	}
	await updateProfile({ $inc: { mincoDollars: -amount } });
	await updateProfile({ $inc: { mincoDollars: amount } }, user.id);

	await interaction.reply(`You gifted ${amount} MD to ${user.toString()}`);
}
