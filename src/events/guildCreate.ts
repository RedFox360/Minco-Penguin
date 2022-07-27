import {
	AuditLogEvent,
	EmbedBuilder,
	PermissionFlagsBits,
	PermissionsBitField
} from 'discord.js';
import { Client, Guild } from 'discord.js';
import { modelClient } from '../main';
const { serverModel } = modelClient;

export default (client: Client) =>
	client.on('guildCreate', async (guild: Guild) => {
		if (
			!guild.members.me.permissions.has(
				PermissionFlagsBits.ViewAuditLog
			)
		)
			return;
		const members = await guild.members.fetch();
		const memberCount = members.filter(
			member => !member.user.bot
		).size;
		if (!(await serverModel.exists({ serverID: guild.id }))) {
			await serverModel.create({
				serverID: guild.id,
				bannedPeople: [],
				memberCount
			});
		}
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.BotAdd
		});
		const moderationInvite = `https://discord.com/oauth2/authorize?client_id=${guild.client.user.id}&scope=bot%20applications.commands&permissions=1375195163862`;
		const hasModPermissions = hasAllPermissions(
			[
				PermissionFlagsBits.ManageRoles,
				PermissionFlagsBits.KickMembers,
				PermissionFlagsBits.BanMembers,
				PermissionFlagsBits.ManageWebhooks,
				PermissionFlagsBits.ModerateMembers
			],
			guild.members.me.permissions
		);
		const embed = new EmbedBuilder()
			.setColor(0x73b384)
			.setTitle('Thanks for adding me to your server!')
			.setDescription(
				hasModPermissions
					? `Minco Penguin uses slash commands! Try them out by typing a slash (/)`
					: `Minco Penguin doesn't have the permissions it needs to use moderation features by default. If you want to use Minco moderation in your server, reinvite Minco Penguin using [this link](${moderationInvite})`
			);
		guild.systemChannel.send({ embeds: [embed] });
		fetchedLogs.entries
			.first()
			.executor.send({
				embeds: [embed]
			})
			.catch(() => {
				// no dm available
			});
	});

function hasAllPermissions(
	needles: bigint[],
	haystack: PermissionsBitField
) {
	for (const needle of needles) {
		if (!haystack.has(needle)) return false;
	}
	return true;
}
