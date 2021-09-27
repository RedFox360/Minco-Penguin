import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import prettyMs from "pretty-ms";
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

export async function run({
	interaction,
	server,
	profileInServerOf,
	updateProfileInServer,
}: CommandData) {
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
	const hasMod = member.roles.cache.has(modRole);
	if (
		member.permissions.has("MANAGE_CHANNELS") ||
		member.permissions.has("MANAGE_GUILD") ||
		(hasMod && !interaction.member.permissions.has("ADMINISTRATOR"))
	) {
		await interaction.reply({
			content: `${user.toString()} cannot be muted`,
			ephemeral: true,
		});
		return;
	}
	const reason = interaction.options.getString("reason");
	const time = interaction.options.getString("time");
	if (time && !ms(time)) {
		await interaction.reply({
			content: "You wrote an invalid time",
			ephemeral: true,
		});
		return;
	}
	const reasonFormat = reason ? `*${reason}*` : "No reason provided";
	const timeFormat = time ? prettyMs(ms(time)) : "Indefinite";
	const addInfraction = {
		reason,
		infractionType: "Mute",
		time: undefined,
		date: Date.now(),
	};
	if (time) addInfraction.time = ms(time);
	updateProfileInServer({ muted: true }, user.id);
	updateProfileInServer(
		{
			$push: {
				infractions: addInfraction,
			},
		},
		user.id
	);
	const muteEmbed = new MessageEmbed()
		.setColor("#E48383")
		.setTitle("Mute Warning")
		.setDescription(
			`${user.toString()} has been muted
Time: ${timeFormat}
Reason: ${reasonFormat}`
		)
		.setFooter(interaction.guild.name)
		.setAuthor(user.username, user.avatarURL());
	member.roles.add(muteRole);
	member.roles.remove(mainRole);
	if (hasMod) member.roles.remove(modRole);

	await interaction.reply({ embeds: [muteEmbed] });
	await user.send(`You were muted in ${interaction.guild.name}
Reason: ${reasonFormat}`);
	console.log(time);
	if (time) {
		setTimeout(async () => {
			const up = await profileInServerOf(user.id);
			if (up.muted) {
				member.roles.add(mainRole);
				member.roles.remove(muteRole);
				if (hasMod) member.roles.add(modRole);
				await interaction.channel.send(`${user.toString()} has been unmuted`);
				await user.send(`You were unmuted in ${interaction.guild.name}`);
				updateProfileInServer({ muted: false }, user.id);
			}
		}, ms(time));
	}
}
