import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandData } from "../../types";
import { TextChannel } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("clear")
	.setDescription("Clear an amount of messages from the channel")
	.addIntegerOption((option) =>
		option
			.setName("amount")
			.setDescription("The amount of messages to clear")
			.setRequired(true)
	);
export const serverOnly = true;
export const permissions = ["MANAGE_MESSAGES"];

export async function run({ interaction }: CommandData) {
	const amount = interaction.options.getInteger("amount");
	if (!(interaction.channel instanceof TextChannel)) {
		await interaction.reply({
			content: "This command cannot be used in this channel",
			ephemeral: true,
		});
		return;
	}
	if (amount > 100) {
		await interaction.reply({
			content: "You cannot delete more than 100 messages",
			ephemeral: true,
		});
		return;
	}
	if (amount < 1) {
		await interaction.reply({
			content: "You must enter a positive number",
			ephemeral: true,
		});
		return;
	}
	await interaction.reply("cleared messages");
	await interaction.deleteReply();
	await (interaction.channel as TextChannel).bulkDelete(amount + 1);
}
