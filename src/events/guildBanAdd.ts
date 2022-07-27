import { EmbedBuilder } from 'discord.js';
import { Client, TextChannel } from 'discord.js';
import { getServer } from '../functions/models';
export default (client: Client) =>
	client.on(
		'guildBanAdd',
		async ({ user, guild, reason, client }) => {
			if (user.bot) return;
			const serverData = await getServer(guild.id);
			if (serverData.silenceBans) return;
			let desc = `${user.tag} flew too close to the sun and was banned from ${guild.name}.`;
			if (reason) desc += `\nReason: *${reason}*`;
			const banEmbed = new EmbedBuilder()
				.setColor(0xf75853) // red
				.setTitle('Banned')
				.setDescription(desc);
			const channel = serverData.welcomeChannel
				? client.channels.cache.get(serverData.welcomeChannel)
				: guild.systemChannel;
			if (!channel) return;
			(channel as TextChannel).send({
				embeds: [banEmbed]
			});
			let userDesc = `${user.tag}, you were banned from ${guild.name}.`;
			if (reason) userDesc += `\nReason: *${reason}*`;
			try {
				await user.send(userDesc);
			} catch (err) {
				// dm not open
			}
		}
	);
