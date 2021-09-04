import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import ms from "ms";

export const data = new SlashCommandBuilder()
	.setName("mute")
	.setDescription("MOD: Mute a user for a specified amount of time")
	.addUserOption((option) =>
		option.setName("user").setDescription("The user to mute").setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName("time")
			.setDescription("The time to mute the user for")
			.setRequired(false)
	)
	.addStringOption((option) =>
		option
			.setName("reason")
			.setDescription("Why you muted that user")
			.setRequired(false)
	);

export async function run({ interaction, server }: CommandData) {
	if (!interaction.guild) {
		await interaction.reply({
			content: "This command can only be used in a server",
			ephemeral: true,
		});
		return;
	}
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
			content: "Bots cannot be muted",
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
			content: `${user.toString()} cannot be muted`,
			ephemeral: true,
		});
		return;
	}
	const reason = interaction.options.getString("reason");
	const reasonFormat = reason ? `*${reason}*` : "No reason provided";
	const muteEmbed = new MessageEmbed()
		.setColor("#E48383")
		.setTitle("Mute Warning")
		.setDescription(
			`${user.toString()} has been muted
Reason: ${reasonFormat}`
		)
		.setFooter(interaction.guild.name)
		.setAuthor(user.username, user.avatarURL());
	console.log(muteRole);
	member.roles.add(muteRole);
	member.roles.remove(mainRole);
	await interaction.reply({ embeds: [muteEmbed] });
	await user.send(`You were muted in ${interaction.guild.name}
Reason: ${reasonFormat}`);

	const time = interaction.options.getString("time");
	if (time) {
		const msTime = ms(time);
		setTimeout(async () => {
			member.roles.add(mainRole);
			member.roles.remove(muteRole);

			await interaction.channel.send(`${user.toString()} has been unmuted`);
			await user.send(`You were unmuted in ${interaction.guild.name}`);
		}, msTime);
	}
}
