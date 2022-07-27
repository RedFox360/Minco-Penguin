import { ChannelType, EmbedBuilder } from 'discord.js';
import { Client } from 'discord.js';
import { getServer } from '../functions/models';

export default (client: Client) =>
	client.on('messageDeleteBulk', async messages => {
		if (!messages.size) return;
		const message = messages.first();
		if (!message.inGuild()) return;
		const { messageLogChannelId, messageLogChannelWebhookId } =
			await getServer(message.guildId);
		if (!messageLogChannelId) return;
		const messageLogChannel = await message.guild.channels.fetch(
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
				name: message.guild.name,
				iconURL: message.guild.iconURL()
			})
			.setDescription(
				`**Bulk delete in ${message.channel}, ${messages.size} messages deleted**`
			);

		await webhook.send({ embeds: [embed] });
	});
