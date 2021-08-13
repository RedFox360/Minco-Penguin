import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

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
	const profile = await profileOf(user.id);
	if (!profile.birthday || profile.birthday.includes("database")) {
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
	const embed = new MessageEmbed()
		.setAuthor(interaction.member.displayName, interaction.user.avatarURL())
		.setDescription("🎂 " + profile.birthday)
		.setColor("#ffc0cb");
	await interaction.reply({ embeds: [embed] });
}
