import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const data = new SlashCommandBuilder()
	.setName("birthday")
	.setDescription("View someone's birthday")
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user whose birthday to view")
			.setRequired(true)
	);

export async function run({ interaction, server, profileOf }: CommandData) {
	const user = interaction.options.getUser("user");
	const { birthday } = await profileOf(interaction.user.id);
	if (!birthday) {
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setDescription(
						"<:Denied:754471937165754458> This user's birthday hasn't been added to the database yet."
					)
					.setColor("#E48383"),
			],
		});
		return;
	}
	const member = await interaction.guild.members.fetch(user.id);
	const date = dayjs.tz(birthday, server.timezone);
	let formatted;
	if (date.year() === 2001) {
		formatted = date.format("MMMM D");
	} else {
		formatted = date.format("MMMM D, YYYY");
	}
	const embed = new MessageEmbed()
		.setAuthor(member.displayName, user.avatarURL())
		.setDescription("🎂 " + formatted)
		.setColor("#ffc0cb");
	await interaction.reply({ embeds: [embed] });
}
