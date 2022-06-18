import { Permissions } from 'discord.js';
import {
	getProfileInServer,
	updateProfileInServer
} from '../../functions/models';
import { SlashCommand } from '../../types';

const toggleBan = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('toggle_ban')
			.setDescription('[Admin only] Ban a user from doing something')
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
			.addSubcommand(subcommand =>
				subcommand
					.setName('sending_messages')
					.setDescription(
						"Makes it so a user's message gets deleted when they send it"
					)
					.addUserOption(option =>
						option
							.setName('user')
							.setDescription('The user to ban')
							.setRequired(true)
					)
			)
	)
	.setPermissions(
		Permissions.FLAGS.MANAGE_GUILD,
		Permissions.FLAGS.MODERATE_MEMBERS
	)
	.setPermissionsRequiredForBot(false)
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
			case 'sending_messages': {
				const nowIsBanned = !userProfile.isShadowBanned;
				await updateProfileInServer(
					{ isShadowBanned: nowIsBanned },
					user.id,
					interaction.guildId
				);
				if (nowIsBanned) {
					await interaction.reply({
						content: `You banned ${user} from sending messages`,
						ephemeral: true
					});
				} else {
					await interaction.reply({
						content: `You unbanned ${user} from sending messages`,
						ephemeral: true
					});
				}
				return;
			}
		}
	});

export default toggleBan;
