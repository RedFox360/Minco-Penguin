import { Permissions } from 'discord.js';
import { updateServer } from '../../functions/models';
import { SlashCommand } from '../../types';

const actionLog = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('action_log')
			.setDescription('Action log commands')
			.addSubcommand(subcommand =>
				subcommand
					.setName('message_and_vc_events')
					.setDescription(
						'Set a channel for message and voice event logs (delete, edit, join, leave, etc.)'
					)
					.addChannelOption(channel =>
						channel
							.setName('channel')
							.setDescription('Leave blank to disable')
							.setRequired(false)
					)
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName('server_events')
					.setDescription(
						'Set a channel for main server events (roles, channels, etc.)'
					)
					.addChannelOption(channel =>
						channel
							.setName('channel')
							.setDescription('Leave blank to disable')
							.setRequired(false)
					)
			)
	)
	.setPermissions(Permissions.FLAGS.MANAGE_GUILD)
	.setPermissionsRequiredForBot(false)
	.setRun(async interaction => {
		const subcommand = interaction.options.getSubcommand();
		const channel = interaction.options.getChannel('channel');
		if (!channel.isText()) {
			await interaction.reply({
				content: 'Please enter a valid text channel',
				ephemeral: true
			});
			return;
		}
		if (
			!channel
				.permissionsFor(interaction.guild.me)
				.has('SEND_MESSAGES')
		) {
			await interaction.reply({
				content:
					'Make sure Minco Penguin has permissions to talk in that channel',
				ephemeral: true
			});
			return;
		}
		if (subcommand === 'message_and_vc_events') {
			await updateServer(
				{
					messageLogChannelId: channel.id
				},
				interaction.guildId
			);
			await interaction.reply({
				content: `Message and voice event logs set to ${channel}`,
				ephemeral: true
			});
		} else {
			await updateServer(
				{
					mainLogChannelId: channel.id
				},
				interaction.guildId
			);
			await interaction.reply({
				content: `Server event logs set to ${channel}`,
				ephemeral: true
			});
		}
	});

export default actionLog;
