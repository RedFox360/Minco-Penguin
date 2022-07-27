import {
	AuditLogEvent,
	ChannelType,
	EmbedBuilder,
	PermissionFlagsBits
} from 'discord.js';
import { Client, Guild } from 'discord.js';
import { getServer } from '../functions/models';

export default (client: Client) => {
	client.on('roleCreate', async role => {
		if (
			!role.guild.members.me.permissions.has(
				PermissionFlagsBits.ViewAuditLog
			)
		)
			return;
		const webhook = await getWebhook(role.guild, role.client);
		const fetchedLogs = await role.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.RoleCreate
		});
		const roleCreationLog = fetchedLogs.entries.first();
		let description: string;
		if (roleCreationLog && roleCreationLog.target.id === role.id) {
			description = `**Role created by ${roleCreationLog.executor}:** \`${role.name}\``;
		} else {
			description = `**Role created:** \`${role.name}\``;
		}
		const embed = new EmbedBuilder()
			.setColor(0x73b384)
			.setAuthor({
				name: role.guild.name,
				iconURL: role.guild.iconURL()
			})
			.setDescription(description)
			.setFooter({
				text: `Role ID: ${role.id}`
			})
			.setTimestamp();

		await webhook.send({ embeds: [embed] });
	});

	client.on('roleDelete', async role => {
		if (
			!role.guild.members.me.permissions.has(
				PermissionFlagsBits.ViewAuditLog
			)
		)
			return;
		const webhook = await getWebhook(role.guild, role.client);

		const fetchedLogs = await role.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.RoleDelete
		});
		const roleDeletionLog = fetchedLogs.entries.first();
		let description: string;
		if (roleDeletionLog && roleDeletionLog.target.id === role.id) {
			description = `**Role deleted by ${roleDeletionLog.executor}:** \`${role.name}\``;
		} else {
			description = `**Role deleted:** \`${role.name}\``;
		}
		const embed = new EmbedBuilder()
			.setColor(0xde481b)
			.setAuthor({
				name: role.guild.name,
				iconURL: role.guild.iconURL()
			})
			.setDescription(description)
			.setFooter({
				text: `Role ID: ${role.id}`
			})
			.setTimestamp();

		await webhook.send({ embeds: [embed] });
	});

	client.on('roleUpdate', async (oldRole, newRole) => {
		if (
			!newRole.guild.members.me.permissions.has(
				PermissionFlagsBits.ViewAuditLog
			)
		)
			return;
		const nameChanged = oldRole.name !== newRole.name;
		const colorChanged = oldRole.color !== newRole.color;
		if (!nameChanged && !colorChanged) return;
		const webhook = await getWebhook(newRole.guild, newRole.client);

		const fetchedLogs = await newRole.guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.RoleUpdate
		});
		const roleUpdateLog = fetchedLogs.entries.first();
		let description = '';
		if (roleUpdateLog && roleUpdateLog.target.id === newRole.id) {
			if (nameChanged) {
				description = `**Role renamed by ${roleUpdateLog.executor}:** \`${oldRole.name}\` → \`${newRole.name}\``;
			}
			if (colorChanged) {
				description += `\n(\`${newRole.name}\`) **Role color changed by ${roleUpdateLog.executor}:** \`${oldRole.hexColor}\` → \`${newRole.hexColor}\``;
			}
		} else {
			if (nameChanged) {
				description = `**Role renamed:** \`${oldRole.name}\` → \`${newRole.name}\``;
			}
			if (colorChanged) {
				description += `\n(\`${newRole.name}\`) **Role color changed:** \`${oldRole.hexColor}\` → \`${newRole.hexColor}\``;
			}
		}

		const embed = new EmbedBuilder()
			.setColor(colorChanged ? newRole.color : 0x537ed1)
			.setAuthor({
				name: newRole.guild.name,
				iconURL: newRole.guild.iconURL()
			})
			.setDescription(description)
			.setFooter({ text: `Role ID: ${newRole.id}` })
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
