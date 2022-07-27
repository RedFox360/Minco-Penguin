import { ChannelType, EmbedBuilder } from 'discord.js';
import {
	Client,
	GuildMember,
	VoiceBasedChannel,
	Webhook
} from 'discord.js';
import { getServer } from '../functions/models';

export default (client: Client) =>
	client.on('voiceStateUpdate', async (oldState, newState) => {
		const { messageLogChannelId, messageLogChannelWebhookId } =
			await getServer(newState.guild.id);
		if (!messageLogChannelId) return;
		const messageLogChannel = await newState.guild.channels.fetch(
			messageLogChannelId,
			{ cache: true }
		);
		if (!messageLogChannel) return;
		if (messageLogChannel.type !== ChannelType.GuildText) return;

		const webhook = await client.fetchWebhook(
			messageLogChannelWebhookId
		);
		const member = newState.member;
		if (!oldState.channel) {
			joinVC(newState.channel, webhook, member);
		} else if (!newState.channel) {
			leaveVC(oldState.channel, webhook, member);
		} else {
			moveVC(oldState.channel, newState.channel, webhook, member);
		}
	});

function joinVC(
	currentChannel: VoiceBasedChannel,
	webhook: Webhook,
	member: GuildMember
) {
	const embed = new EmbedBuilder()
		.setColor(0x73b384)
		.setAuthor({
			name: member.user.tag,
			iconURL: member.displayAvatarURL()
		})
		.setDescription(
			`**${member} joined voice channel ${currentChannel}**`
		)
		.setFooter({
			text: `Member ID: ${member.id} | Channel ID: ${currentChannel.id}`
		})
		.setTimestamp();

	webhook.send({ embeds: [embed] });
}

function leaveVC(
	channelLeft: VoiceBasedChannel,
	webhook: Webhook,
	member: GuildMember
) {
	const embed = new EmbedBuilder()
		.setColor(0xde481b)
		.setAuthor({
			name: member.user.tag,
			iconURL: member.displayAvatarURL()
		})
		.setDescription(`**${member} left voice channel ${channelLeft}**`)
		.setFooter({
			text: `Member ID: ${member.id} | Channel ID: ${channelLeft.id}`
		})
		.setTimestamp();

	webhook.send({ embeds: [embed] });
}

function moveVC(
	oldChannel: VoiceBasedChannel,
	newChannel: VoiceBasedChannel,
	webhook: Webhook,
	member: GuildMember
) {
	const embed = new EmbedBuilder()
		.setColor(0x537ed1)
		.setAuthor({
			name: member.user.tag,
			iconURL: member.displayAvatarURL()
		})
		.setDescription(
			`**${member} switched voice channel ${oldChannel} → ${newChannel}**`
		)
		.setFooter({
			text: `Member ID: ${member.id} | Current Channel ID: ${newChannel.id}`
		})
		.setTimestamp();

	webhook.send({ embeds: [embed] });
}
