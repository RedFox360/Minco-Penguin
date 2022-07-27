import { ChannelType, EmbedBuilder } from 'discord.js';
import { Client } from 'discord.js';
import { getServer } from '../functions/models';

export default (client: Client) =>
	client.on('messageUpdate', async (oldMessage, newMessage) => {
		if (newMessage.author.bot) return;
		if (!newMessage.content || !oldMessage.content) return;
		if (!newMessage.inGuild()) return;
		const { messageLogChannelId, messageLogChannelWebhookId } =
			await getServer(newMessage.guildId);
		if (!messageLogChannelId) return;
		const messageLogChannel = await newMessage.guild.channels.fetch(
			messageLogChannelId,
			{ cache: true }
		);
		if (!messageLogChannel) return;
		if (messageLogChannel.type !== ChannelType.GuildText) return;

		const webhook = await client.fetchWebhook(
			messageLogChannelWebhookId
		);
		const embed = new EmbedBuilder()
			.setColor(0x537ed1)
			.setAuthor({
				name: newMessage.author.tag,
				iconURL: newMessage.member.displayAvatarURL()
			})
			.setDescription(
				`**Message edited in ${newMessage.channel}** [Jump to message](${newMessage.url})`
			)
			.addFields(
				{ name: 'Before', value: oldMessage.content },
				{ name: 'After', value: newMessage.content }
			)
			.setFooter({
				text: `Author ID: ${newMessage.author.id} | Message ID: ${newMessage.id}`
			})
			.setTimestamp(newMessage.createdTimestamp);

		await webhook.send({ embeds: [embed] });
	});
