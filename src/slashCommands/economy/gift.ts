import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("gift")
	.setDescription("Gift money to a user!")
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user to gift money to")
			.setRequired(true)
	)
	.addIntegerOption((option) =>
		option
			.setName("md_amount")
			.setDescription("The amount of money to gift")
			.setRequired(true)
	);

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
