import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("marriage")
	.setDescription("View a marriage status")
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user whose marriage to view")
			.setRequired(false)
	);

export async function run({ interaction, profileOf }: CommandData) {
	const userOption = interaction.options.getUser("user");
	const user = userOption ?? interaction.user;
	const profile = await profileOf(user.id);
	const are = userOption ? `${user.toString()} is` : "You are";
	if (!profile.spouse) {
		await interaction.reply(`${are} not married`);
		return;
	}
	const marriageEmbed = new MessageEmbed()
		.setTitle(":ring: Marriage")
		.setDescription(`${are} currently married to <@${profile.spouse}>`)
		.setColor("#BEDFFF");
	await interaction.reply({ embeds: [marriageEmbed] });
}
