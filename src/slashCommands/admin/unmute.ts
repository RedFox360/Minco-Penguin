import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("unmute")
	.setDescription("MOD: Unmutes a user")
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user to unmute")
			.setRequired(true)
	);

export async function run({ interaction, server }: CommandData) {
	const { muteRole, mainRole, modRole } = server;

	if (
		!interaction.member.permissions.has("MANAGE_CHANNELS") &&
		!interaction.member.permissions.has("MANAGE_GUILD") &&
		!interaction.member.roles.cache.has(modRole)
	) {
		await interaction.reply({
			content: "You don't have the correct permissions to execute this command",
			ephemeral: true,
		});
		return;
	}
	if (!muteRole) {
		await interaction.reply({
			content: "This server doesn't have a mute role!",
			ephemeral: true,
		});
		return;
	}
	if (!mainRole) {
		await interaction.reply({
			content: "This server doesn't have a main role!",
			ephemeral: true,
		});
		return;
	}

	const user = interaction.options.getUser("user");
	const member = await interaction.guild.members.fetch(user.id);

	if (user.bot) {
		await interaction.reply({
			content: "Bots cannot be unmuted",
			ephemeral: true,
		});
		return;
	}
	if (
		member.permissions.has("MANAGE_CHANNELS") ||
		member.permissions.has("MANAGE_GUILD") ||
		member.roles.cache.has(modRole)
	) {
		await interaction.reply({
			content: `${user.toString()} cannot be unmuted`,
			ephemeral: true,
		});
		return;
	}

	member.roles.add(mainRole);
	member.roles.remove(muteRole);

	await interaction.reply(`You unmuted ${user.toString()}`);
	await user.send(`You were unmuted in ${interaction.guild.name}`);
}
