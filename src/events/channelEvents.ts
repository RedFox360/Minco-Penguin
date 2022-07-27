import {
	AuditLogEvent,
	ChannelType,
	EmbedBuilder,
	PermissionFlagsBits
} from 'discord.js';
import {
	Client,
	DMChannel,
	Guild,
	NonThreadGuildBasedChannel
} from 'discord.js';
import { getServer } from '../functions/models';

export default (client: Client) => {
	client.on('channelCreate', async channel => {
		if (
			!channel.guild.members.me.permissions.has(
				PermissionFlagsBits.ViewAuditLog
			)
		)
			return;
		const webhook = await getWebhook(channel.guild, channel.client);
		const fetchedLogs = await channel.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.ChannelCreate
		});
		const channelCreationLog = fetchedLogs.entries.first();
		const channelType = typeofChannel(channel);
		let description: string;
		if (
			channelCreationLog &&
			channelCreationLog.target.id === channel.id
		) {
			description = `**${channelType} channel created by ${channelCreationLog.executor}:** \`${channel.name}\``;
		} else {
			description = `**${channelType} channel created:** \`${channel.name}\``;
		}
		const embed = new EmbedBuilder()
			.setColor(0x73b384)
			.setAuthor({
				name: channel.guild.name,
				iconURL: channel.guild.iconURL()
			})
			.setDescription(description)
			.setFooter({
				text: `Channel ID: ${channel.id}`
			})
			.setTimestamp();

		await webhook.send({ embeds: [embed] });
	});

	client.on('channelDelete', async channel => {
		if (channel.type === ChannelType.DM) return;
		if (
			!channel.guild.members.me.permissions.has(
				PermissionFlagsBits.ViewAuditLog
			)
		)
			return;
		const webhook = await getWebhook(channel.guild, channel.client);

		const fetchedLogs = await channel.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.ChannelDelete
		});
		const channelDeletionLog = fetchedLogs.entries.first();
		const channelType = typeofChannel(channel);
		let description: string;
		if (
			channelDeletionLog &&
			(channelDeletionLog.target as any)?.id === channel.id
		) {
			description = `**${channelType} channel deleted by ${channelDeletionLog.executor}:** \`${channel.name}\``;
		} else {
			description = `**${channelType} channel deleted:** \`${channel.name}\``;
		}
		const embed = new EmbedBuilder()
			.setColor(0xde481b)
			.setAuthor({
				name: channel.guild.name,
				iconURL: channel.guild.iconURL()
			})
			.setDescription(description)
			.setFooter({
				text: `Channel ID: ${channel.id}`
			})
			.setTimestamp();

		await webhook.send({ embeds: [embed] });
	});

	client.on('channelUpdate', async (oldChannel, newChannel) => {
		if (
			newChannel.type === ChannelType.DM ||
			oldChannel.type === ChannelType.DM
		)
			return;
		if (
			!newChannel.guild.members.me.permissions.has(
				PermissionFlagsBits.ViewAuditLog
			)
		)
			return;
		if (oldChannel.name === newChannel.name) return;

		const webhook = await getWebhook(
			newChannel.guild,
			newChannel.client
		);

		const fetchedLogs = await newChannel.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.ChannelUpdate
		});
		const channelUpdateLog = fetchedLogs.entries.first();
		const channelType = typeofChannel(newChannel);
		let description: string;
		if (
			channelUpdateLog &&
			channelUpdateLog.target.id === newChannel.id
		) {
			description = `**${channelType} channel renamed by ${channelUpdateLog.executor}:** \`${oldChannel.name}\` → \`${newChannel.name}\``;
		} else {
			description = `**${channelType} channel renamed:** \`${oldChannel.name}\` → \`${newChannel.name}\``;
		}

		const embed = new EmbedBuilder()
			.setColor(0x537ed1)
			.setAuthor({
				name: newChannel.guild.name,
				iconURL: newChannel.guild.iconURL()
			})
			.setDescription(description)
			.setFooter({ text: `Channel ID: ${newChannel.id}` })
			.setTimestamp();

		await webhook.send({ embeds: [embed] });
	});
};

async function getWebhook(guild: Guild, client: Client) {
	const { mainLogChannelId, mainLogChannelWebhookId } =
		await getServer(guild.id);
	if (!mainLogChannelId) return;
	const mainLogChannel = await guild.channels.fetch(
		mainLogChannelId,
		{ cache: true }
	);
	if (!mainLogChannel) return;
	if (mainLogChannel.type !== ChannelType.GuildText) return;

	const webhook = await client.fetchWebhook(mainLogChannelWebhookId);
	return webhook;
}

function typeofChannel(channel: NonThreadGuildBasedChannel) {
	switch (channel.type) {
		case ChannelType.GuildCategory: {
			return 'Category';
		}
		case ChannelType.GuildNews: {
			return 'News';
		}
		case ChannelType.GuildStageVoice: {
			return 'Stage';
		}
		case ChannelType.GuildText: {
			return 'Text';
		}
		case ChannelType.GuildVoice: {
			return 'Voice';
		}
	}
}
