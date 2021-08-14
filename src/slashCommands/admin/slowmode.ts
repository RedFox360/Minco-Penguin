import { CommandData } from "../../types";
import { MessageEmbed, TextChannel } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("slowmode")
	.setDescription("Set the slowmode of a channel")
	.addIntegerOption((option) =>
		option.setName("time").setDescription("The slowmode time").setRequired(true)
	);

export const permissions = ["MANAGE_CHANNELS"];

export async function run({ interaction }: CommandData) {
	const time = interaction.options.getInteger("time");
	if (time > 21600) {
		await interaction.reply({
			content: "Please enter an amount less than 21600 (6 hours)",
			ephemeral: true,
		});
		return;
	}
	if (interaction.guild) {
		(interaction.channel as TextChannel).setRateLimitPerUser(time);
		let confirmEmbed = new MessageEmbed()
			.setColor("#7E78D2")
			.setTitle("Slowmode")
			.setDescription(`Slowmode set to ${time} seconds`);
		await interaction.reply({ embeds: [confirmEmbed] });
	} else {
		await interaction.reply({
			content: "This command can only be used in a server",
			ephemeral: true,
		});
		return;
	}
}
