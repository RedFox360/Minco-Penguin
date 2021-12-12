import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import dayjs from "dayjs";

export const data = new SlashCommandBuilder()
	.setName("birthday")
	.setDescription("View someone's birthday")
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user whose birthday to view")
			.setRequired(true)
	);

export async function run({ interaction, profileOf }: CommandData) {
	const user = interaction.options.getUser("user");
	const { birthday } = await profileOf(user.id);
	if (!birthday) {
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setDescription(
						"<:x_circle:872594799553839114> This user's birthday hasn't been added to the database yet."
					)
					.setColor("#E48383"),
			],
		});
		return;
	}
	const member = await interaction.guild.members.fetch(user.id);
	const date = dayjs(birthday);
	let formatted: string;
	if (date.year() === 2001) {
		formatted = date.format("MMMM D");
	} else {
		formatted = date.format("MMMM D, YYYY");
	}
	const avatar = user
		? user.displayAvatarURL({ dynamic: true })
		: interaction.member.displayAvatarURL({ dynamic: true });
	const embed = new MessageEmbed()
		.setAuthor(member.displayName, avatar)
		.setDescription("🎂 " + formatted)
		.setColor("#ffc0cb");
	await interaction.reply({ embeds: [embed] });
}
