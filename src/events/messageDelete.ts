import {
	AuditLogEvent,
	ChannelType,
	EmbedBuilder,
	PermissionFlagsBits
} from 'discord.js';
import { Client, Message } from 'discord.js';
import { getServer } from '../functions/models';

export default (client: Client) =>
	client.on('messageDelete', async (message: Message) => {
		if (!message.inGuild()) return;
		if (message.author.bot) return;
		const { messageLogChannelId, messageLogChannelWebhookId } =
			await getServer(message.guildId);
		if (!messageLogChannelId) return;
		const messageLogChannel = await message.guild.channels.fetch(
			messageLogChannelId,
			{ cache: true }
		);
		if (!messageLogChannel) return;
		if (
			!message.guild.members.me.permissions.has(
				PermissionFlagsBits.ViewAuditLog
			)
		)
			return;
		if (messageLogChannel.type !== ChannelType.GuildText) return;

		const webhook = await client.fetchWebhook(
			messageLogChannelWebhookId
		);

		const fetchedLogs = await message.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MessageDelete
		});
		const deletionLog = fetchedLogs.entries.first();
		let description: string;
		if (deletionLog && deletionLog.target.id === message.author.id) {
			description = `**Message sent by ${message.author} deleted from ${message.channel} by ${deletionLog.executor}**
${message.content}`;
		} else {
			description = `**Message sent by ${message.author} deleted from ${message.channel}**
${message.content}`;
		}

		const embed = new EmbedBuilder()
			.setColor(0xde481b)
			.setAuthor({
				name: message.author.tag,
				iconURL: message.member.displayAvatarURL()
			})
			.setDescription(description)
			.setFooter({
				text: `Author ID: ${message.author.id} | Message ID: ${message.id}`
			})
			.setTimestamp(message.createdTimestamp);

		const { attachments } = message;
		const images = attachments.filter(a =>
			a.contentType.startsWith('image')
		);
		if (images.size === 1) {
			embed.setImage(images.first().url);
			await webhook.send({ embeds: [embed] });
		} else if (images.size > 1) {
			await webhook.send({
				embeds: [embed],
				files: Array.from(images.values())
			});
		} else {
			await webhook.send({
				embeds: [embed]
			});
		}
	});
