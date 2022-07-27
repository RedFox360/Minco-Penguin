import { PermissionFlagsBits } from 'discord.js';
import { BaseGuildTextChannel } from 'discord.js';
import { getServer, updateServer } from '../../functions/models';
import { SlashCommand } from '../../types';

const actionLog = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('action-log')
			.setDescription('Action log commands')
			.setDefaultMemberPermissions(
				PermissionFlagsBits.ManageGuild |
					PermissionFlagsBits.ViewAuditLog |
					PermissionFlagsBits.ManageWebhooks
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName('message-and-vc-events')
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
					.setName('server-events')
					.setDescription(
						'Set a channel for main server events (roles, channels, users, etc.)'
					)
					.addChannelOption(channel =>
						channel
							.setName('channel')
							.setDescription('Leave blank to disable')
							.setRequired(false)
					)
			)
	)
	.setBotPermissions(
		PermissionFlagsBits.ManageWebhooks,
		PermissionFlagsBits.ViewAuditLog
	)
	.setRun(async interaction => {
		const subcommand = interaction.options.getSubcommand();
		const inDev = !process.argv.includes('--prod');
		const channel = interaction.options.getChannel('channel');
		if (!(channel instanceof BaseGuildTextChannel)) {
			await interaction.reply({
				content: 'Please enter a valid text channel',
				ephemeral: true
			});
			return;
		}
		const isMessageEvents = subcommand === 'message_and_vc_events';
		const myPerms = channel.permissionsFor(
			interaction.guild.members.me
		);
		if (
			!myPerms.has(PermissionFlagsBits.SendMessages) ||
			!myPerms.has(PermissionFlagsBits.ManageWebhooks)
		) {
			await interaction.reply({
				content:
					'Make sure Minco Penguin has permissions to talk and create webhooks in that channel',
				ephemeral: true
			});
			return;
		}
		const serverData = await getServer(interaction.guildId);
		const existingWebhooks = await channel.fetchWebhooks();
		let webhookId: string;
		if (
			isMessageEvents &&
			channel.id === serverData.mainLogChannelId
		) {
			webhookId = serverData.mainLogChannelWebhookId;
		} else if (
			!isMessageEvents &&
			channel.id === serverData.messageLogChannelId
		) {
			webhookId = serverData.messageLogChannelWebhookId;
		} else {
			webhookId = (
				existingWebhooks.find(
					webhook => webhook.channelId === channel.id
				) ??
				(await channel.createWebhook({
					avatar: inDev
						? 'https://cdn.discordapp.com/avatars/870403396241350816/cf47755138f460065a4fdfadc54e9edb.png?size=256'
						: 'https://cdn.discordapp.com/avatars/725917919292162051/339bd910d2e3872a5197507f96258e7c.png?size=256',
					name: inDev
						? 'Minco Penguin Canary Logger'
						: 'Minco Penguin Logger'
				}))
			).id;
		}
		if (isMessageEvents) {
			await updateServer(
				{
					messageLogChannelId: channel?.id,
					messageLogChannelWebhookId: webhookId
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
					mainLogChannelId: channel?.id,
					mainLogChannelWebhookId: webhookId
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
