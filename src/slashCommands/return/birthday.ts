import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
export const data = {
	name: "birthday",
	description: "View someone's birthday",
	options: [
		{
			name: "user",
			description: "The user whose birthday the bot will send",
			type: "USER",
			required: true,
		},
	],
};

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
