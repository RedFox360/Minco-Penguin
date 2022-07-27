import {
	AuditLogEvent,
	ChannelType,
	EmbedBuilder,
	PermissionFlagsBits
} from 'discord.js';
import {
	Client,
	GuildMember,
	PartialGuildMember,
	Webhook
} from 'discord.js';
import { getServer } from '../functions/models';

export default (client: Client) =>
	client.on('guildMemberUpdate', async (oldMember, newMember) => {
		if (
			!newMember.guild.members.me.permissions.has(
				PermissionFlagsBits.ViewAuditLog
			)
		)
			return;
		if (newMember.user.bot) return;
		const updatedRoles =
			oldMember.roles.cache.size !== newMember.roles.cache.size;
		const updatedNickname = oldMember.nickname !== newMember.nickname;
		if (!updatedRoles && !updatedNickname) return;
		const { mainLogChannelId, mainLogChannelWebhookId } =
			await getServer(newMember.guild.id);
		if (!mainLogChannelId) return;
		const mainLogChannel = await newMember.guild.channels.fetch(
			mainLogChannelId,
			{ cache: true }
		);
		if (!mainLogChannel) return;
		if (mainLogChannel.type !== ChannelType.GuildText) return;

		const webhook = await client.fetchWebhook(
			mainLogChannelWebhookId
		);

		if (updatedRoles) await roleUpdate(oldMember, newMember, webhook);
		else if (updatedNickname)
			await nicknameUpdate(oldMember, newMember, webhook);
	});

async function roleUpdate(
	oldMember: GuildMember | PartialGuildMember,
	newMember: GuildMember | PartialGuildMember,
	webhook: Webhook
) {
	const embed = getEmbed(newMember);
	const fetchedLogs = await newMember.guild.fetchAuditLogs({
		limit: 1,
		type: AuditLogEvent.MemberRoleUpdate
	});
	const updateLog = fetchedLogs.entries.first();
	if (oldMember.roles.cache.size < newMember.roles.cache.size) {
		// role added
		const addedRoles = newMember.roles.cache.filter(
			role => !oldMember.roles.cache.has(role.id)
		);
		const formatRoles = addedRoles
			.map(role => `\`${role.name}\``)
			.join(', ');
		if (!addedRoles.size) return;
		if (addedRoles.size > 1) {
			embed.setDescription(
				`**${newMember} was given the roles** ${formatRoles}`
			);
		} else {
			embed.setDescription(
				`**${newMember} was given the** ${formatRoles} **role**`
			);
		}
	} else {
		// role removed
		const removedRoles = oldMember.roles.cache.filter(
			role => !newMember.roles.cache.has(role.id)
		);
		const formatRoles = removedRoles
			.map(role => `\`${role.name}\``)
			.join(', ');

		if (!removedRoles.size) return;
		if (removedRoles.size > 1) {
			embed.setDescription(
				`**${newMember} was removed from the roles** ${formatRoles}`
			);
		} else {
			embed.setDescription(
				`**${newMember} was removed from the** ${formatRoles} **role**`
			);
		}
	}
	if (updateLog && updateLog.target.id === newMember.id)
		embed.setDescription(
			embed.data.description + ` **by ${updateLog.executor}**`
		);

	await webhook.send({ embeds: [embed] });
}

async function nicknameUpdate(
	oldMember: GuildMember | PartialGuildMember,
	newMember: GuildMember | PartialGuildMember,
	webhook: Webhook
) {
	const embed = getEmbed(newMember).setDescription(
		`**${newMember}'s nickname was changed:** \`${oldMember.nickname}\` → \`${newMember.nickname}\``
	);
	await webhook.send({ embeds: [embed] });
}

function getEmbed(member: GuildMember | PartialGuildMember) {
	return new EmbedBuilder()
		.setColor(0x537ed1)
		.setAuthor({
			name: member.user.tag,
			iconURL: member.user.displayAvatarURL()
		})
		.setFooter({
			text: `User ID: ${member.id}`
		})
		.setTimestamp();
}
