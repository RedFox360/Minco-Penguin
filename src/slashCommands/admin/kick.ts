import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("kick")
	.setDescription("MOD: Kick a user")
	.addUserOption((option) =>
		option.setName("user").setDescription("The user to kick").setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName("reason")
			.setDescription("Why you want to kick that user")
			.setRequired(false)
	);

export const permissions = ["KICK_MEMBERS"];

export async function run({ interaction, updateProfileInServer }: CommandData) {
	if (!interaction.guild) {
		await interaction.reply({
			content: "This command can only be used in a server",
			ephemeral: true,
		});
		return;
	}
	const user = interaction.options.getUser("user");
	const member = await interaction.guild.members.fetch(user);
	const reason = interaction.options.getString("reason");

	const { infractions } = await updateProfileInServer(
		{
			$push: {
				infractions: { reason, infractionType: "Kick", date: Date.now() },
			},
		},
		user.id
	);
	const reasonFormat = reason ? `*${reason}*` : "No reason provided";
	const kickEmbed = new MessageEmbed()
		.setColor("#E48383")
		.setTitle("Kicked")
		.setDescription(
			`${user.toString()} has been kicked
Case #${infractions.length}
Reason: ${reasonFormat}`
		)
		.setFooter(interaction.guild.name)
		.setAuthor(user.username, user.avatarURL());
	await member.kick(reason);
	await interaction.reply({ embeds: [kickEmbed] });
	await user.send(`You were kicked from ${interaction.guild.name}
Reason: ${reasonFormat}`);
}
