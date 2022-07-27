import {
	ChannelType,
	ChatInputCommandInteraction,
	GuildExplicitContentFilter,
	GuildMFALevel,
	GuildNSFWLevel,
	GuildVerificationLevel
} from 'discord.js';
import { EmbedBuilder, time, userMention } from 'discord.js';
import { getServer } from '../models';
import ordinal from 'ordinal';

export default async function run(
	interaction: ChatInputCommandInteraction<'cached'>
) {
	await interaction.deferReply();
	const server = await getServer(interaction.guildId);

	const channels = await interaction.guild.channels.fetch();
	const textChannelAmount = channels.filter(
		channel => channel.type === ChannelType.GuildText
	).size;
	const voiceChannelAmount = channels.filter(
		channel => channel.type === ChannelType.GuildVoice
	).size;
	const categoryAmount = channels.filter(
		channel => channel.type === ChannelType.GuildCategory
	).size;
	const roleAmount = (await interaction.guild.roles.fetch()).size;
	const totalChannelAmount = textChannelAmount + voiceChannelAmount;
	const emojiCount = (await interaction.guild.emojis.fetch()).size;
	const welcomeMessage = replace(
		server.welcomeMessage,
		interaction,
		server.memberCount
	);
	let formattedNSFWLevel;
	switch (interaction.guild.nsfwLevel) {
		case GuildNSFWLevel.Safe: {
			formattedNSFWLevel = '`Safe`';
			break;
		}
		case GuildNSFWLevel.Default: {
			formattedNSFWLevel = '`Default`';
			break;
		}
		case GuildNSFWLevel.Explicit: {
			formattedNSFWLevel = '`Explicit`';
			break;
		}
		case GuildNSFWLevel.AgeRestricted: {
			formattedNSFWLevel = '`Age Restricted`';
			break;
		}
	}
	let formattedExplicitLevel;
	switch (interaction.guild.explicitContentFilter) {
		case GuildExplicitContentFilter.Disabled: {
			formattedExplicitLevel = '`Disabled`';
			break;
		}
		case GuildExplicitContentFilter.MembersWithoutRoles: {
			formattedExplicitLevel = '`Members without roles`';
			break;
		}
		case GuildExplicitContentFilter.AllMembers: {
			formattedExplicitLevel = '`All members`';
			break;
		}
		default: {
			formattedExplicitLevel = '`Unknown`';
			break;
		}
	}
	const leaveMessage = replace(
		server.leaveMessage,
		interaction,
		server.memberCount
	);

	const welcomeDM = server.welcomeDM
		? replace(server.welcomeDM, interaction, server.memberCount)
		: '`None`';
	const verificationLevel = (() => {
		switch (interaction.guild.verificationLevel) {
			case GuildVerificationLevel.None:
				return '`None`';
			case GuildVerificationLevel.Low:
				return '`Low`';
			case GuildVerificationLevel.Medium:
				return '`Medium`';
			case GuildVerificationLevel.High:
				return '`High`';
			case GuildVerificationLevel.VeryHigh:
				return '`Very High`';
		}
	})();
	const infoEmbed = new EmbedBuilder()
		.setAuthor({
			name: interaction.guild.name,
			url: interaction.guild.iconURL(),
			iconURL: interaction.guild.iconURL()
		})
		.setTitle(':bulb: Server Info')
		.setColor(0xdfbe33)
		.addFields(
			{
				name: 'Name',
				value: '`' + interaction.guild.name + '`',
				inline: true
			},
			{
				name: 'ID',
				value: '`' + interaction.guildId + '`',
				inline: true
			},
			{
				name: 'Server owner',
				value: userMention(interaction.guild.ownerId),
				inline: true
			},
			{
				name: 'Created at',
				value: time(interaction.guild.createdAt),
				inline: true
			},
			{
				name: 'Minco Penguin joined at',
				value: time(interaction.guild.joinedAt),
				inline: true
			},
			{
				name: 'Server Locale',
				value: '`' + interaction.guild.preferredLocale + '`',
				inline: true
			},
			{
				name: 'Channel amounts',
				value: `Text: \`${textChannelAmount}\`  |  Voice: \`${voiceChannelAmount}\`  |  Categories: \`${categoryAmount}\`  |  Total: \`${totalChannelAmount}\``,
				inline: true
			},
			{
				name: 'Server Timezone',
				value: `\`${server.timezone}\``,
				inline: true
			},
			{
				name: 'Member Count',
				value: `Non Bots: \`${server.memberCount}\`
All Members: \`${interaction.guild.memberCount}\``,
				inline: true
			},
			{
				name: 'Highest Role',
				value: interaction.guild.roles.highest.toString(),
				inline: true
			},
			{
				name: 'Emoji Count',
				value: '`' + emojiCount + '`',
				inline: true
			},
			{
				name: 'Role Count',
				value:
					'`' + roleAmount.toLocaleString(interaction.locale) + '`',
				inline: true
			},
			{
				name: 'Partnered',
				value: '`' + interaction.guild.partnered + '`',
				inline: true
			},
			{
				name: 'Verified',
				value: '`' + interaction.guild.verified + '`',
				inline: true
			},
			{
				name: 'Mod requires 2FA',
				value:
					'`' +
					(interaction.guild.mfaLevel === GuildMFALevel.Elevated) +
					'`',
				inline: true
			},
			{
				name: 'Rules Channel',
				value: (
					interaction.guild.rulesChannel ?? '`None`'
				).toString(),
				inline: true
			},
			{
				name: 'System Channel',
				value: (
					interaction.guild.systemChannel ?? '`None`'
				).toString(),
				inline: true
			},
			{
				name: 'AFK Channel',
				value: (interaction.guild.afkChannel ?? '`None`').toString(),
				inline: true
			},
			{
				name: 'Verification Level',
				value: verificationLevel,
				inline: true
			},
			{
				name: 'NSFW Level',
				value: formattedNSFWLevel,
				inline: true
			},
			{
				name: 'Explicit Content Filter',
				value: formattedExplicitLevel,
				inline: true
			},
			{
				name: 'Welcome Message',
				value: welcomeMessage,
				inline: true
			},
			{
				name: 'Leave Message',
				value: leaveMessage,
				inline: true
			},
			{
				name: 'Welcome DM',
				value: welcomeDM,
				inline: true
			}
		)
		.setTimestamp();
	await interaction.editReply({ embeds: [infoEmbed] });
}

const replace = (
	msg: string,
	interaction: ChatInputCommandInteraction<'cached'>,
	memberCount: number
) =>
	msg
		.replace(/\{server\}/g, interaction.guild.name)
		.replace(/\{mention\}/g, interaction.user.toString())
		.replace(/\{ord_member_count\}/g, ordinal(memberCount))
		.replace(
			/\{member_count\}/g,
			memberCount.toLocaleString(interaction.locale)
		)
		.replace(/\{user\}/g, interaction.user.username)
		.replace(/\{user_tag\}/g, interaction.user.tag);
