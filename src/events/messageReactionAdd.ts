import { ChannelType, EmbedBuilder } from 'discord.js';
import { Client, MessageReaction } from 'discord.js';
import { getServer } from '../functions/models';

export default (client: Client) =>
	client.on(
		'messageReactionAdd',
		async (reaction: MessageReaction) => {
			if (!reaction) return;
			const { message } = reaction;
			if (!message) return;
			if (!message.inGuild()) return;
			if (
				reaction.emoji.name !== '⭐' &&
				reaction.emoji.name !== '🌟'
			)
				return;
			const serverData = await getServer(message.guildId);
			const { channelID, starAmount } = serverData.starboard;

			if (!channelID) return;
			if (reaction.count !== starAmount) return;
			if (message.author.bot) return;

			const channel = await reaction.client.channels.fetch(channelID);
			if (channel.type !== ChannelType.GuildText) return;
			const name = message.channel.name;
			const nameFormat = name ? `#${name}` : message.id;
			const embed = new EmbedBuilder()
				.setAuthor({
					name: message.member.displayName,
					iconURL: message.author.displayAvatarURL(),
					url: message.url
				})
				.setDescription(
					`${message.content}

[Jump to message](${message.url})`
				)
				.setFooter({ text: `⭐️  | ${nameFormat}` })
				.setTimestamp(message.createdTimestamp)
				.setColor(0xf7dc6f); // yellow
			channel.send({
				embeds: [embed],
				files: Array.from(message.attachments.values())
			});
		}
	);
