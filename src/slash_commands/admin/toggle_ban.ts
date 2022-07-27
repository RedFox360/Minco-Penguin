import { PermissionFlagsBits } from 'discord.js';
import {
	getProfileInServer,
	updateProfileInServer
} from '../../functions/models';
import { SlashCommand } from '../../types';

const toggleBan = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('toggle-ban')
			.setDescription('[Admin only] Ban a user from doing something')
			.setDefaultMemberPermissions(
				PermissionFlagsBits.ManageGuild |
					PermissionFlagsBits.ModerateMembers
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName('commands')
					.setDescription(
						'Ban a user from using Minco Penguin commands in the server'
					)
					.addUserOption(option =>
						option
							.setName('user')
							.setDescription('The user to ban')
							.setRequired(true)
					)
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName('confessions')
					.setDescription(
						'Ban a user from using Minco Penguin confessions in the server'
					)
					.addUserOption(option =>
						option
							.setName('user')
							.setDescription('The user to ban')
							.setRequired(true)
					)
			)
	)
	.setRun(async interaction => {
		const user = interaction.options.getUser('user');
		const userProfile = await getProfileInServer(
			user.id,
			interaction.guildId
		);
		if (user.id === interaction.user.id) {
			await interaction.reply({
				content: "You can't ban yourself!",
				ephemeral: true
			});
			return;
		}
		switch (interaction.options.getSubcommand()) {
			case 'commands': {
				const nowIsBanned = !userProfile.bannedFromCommands;
				await updateProfileInServer(
					{ bannedFromCommands: nowIsBanned },
					user.id,
					interaction.guildId
				);
				if (nowIsBanned) {
					await interaction.reply({
						content: `You banned ${user} from Minco Penguin`,
						ephemeral: true
					});
				} else {
					await interaction.reply({
						content: `You unbanned ${user} from Minco Penguin`,
						ephemeral: true
					});
				}
				return;
			}
			case 'confessions': {
				const nowIsBanned = !userProfile.bannedFromConfessions;
				await updateProfileInServer(
					{ bannedFromConfessions: nowIsBanned },
					user.id,
					interaction.guildId
				);
				if (nowIsBanned) {
					await interaction.reply({
						content: `You banned ${user} from sending confessions`,
						ephemeral: true
					});
				} else {
					await interaction.reply({
						content: `You unbanned ${user} from sending confessions`,
						ephemeral: true
					});
				}
				return;
			}
		}
	});

export default toggleBan;
