import { CommandData } from "../../types";
import { MessageEmbed, TextChannel } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import ms from "ms";
import prettyMs from "pretty-ms";

export const data = new SlashCommandBuilder()
	.setName("slowmode")
	.setDescription("Set the slowmode of a channel")
	.addStringOption((option) =>
		option
			.setName("time")
			.setDescription("The slowmode time (e.g. 1, 1s, 3h, 1m)")
			.setRequired(true)
	);

export const permissions = ["MANAGE_CHANNELS"];
export const serverOnly = true;
export async function run({ interaction }: CommandData) {
	let timeString = interaction.options.getString("time");
	let unary = +timeString;
	let time = isNaN(unary) ? ms(timeString) / 1000 : unary;

	if (isNaN(time)) {
		await interaction.reply({
			content: "You wrote an invalid time",
			ephemeral: true,
		});
		return;
	}
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
			.setDescription(
				`Slowmode set to ${time} seconds (${prettyMs(time * 1000)})`
			);
		await interaction.reply({ embeds: [confirmEmbed] });
	} else {
		await interaction.reply({
			content: "This command can only be used in a server",
			ephemeral: true,
		});
		return;
	}
}
