import { Client, GuildBan } from 'discord.js';
import { getServer } from '../functions/models';
export default (client: Client) =>
	client.on('guildBanRemove', async ({ user, guild }: GuildBan) => {
		if (user.bot) return;
		if ((await getServer(guild.id)).silenceBans) return;
		try {
			await user.send(
				`${user.tag}, you were unbanned from ${guild.name}.`
			);
		} catch (err) {
			// dms not open
		}
	});
