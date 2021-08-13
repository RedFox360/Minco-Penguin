import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";

export const data = {
	name: "marriage",
	description: "View a marriage status",
	options: [
		{
			name: "user",
			description: "The user whose marriage to view",
			type: "USER",
			required: false,
		},
	],
};

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
