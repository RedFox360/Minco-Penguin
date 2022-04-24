import serverModel from '../models/serverSchema';
import { GuildBan } from 'discord.js';
export default async ({ user, guild }: GuildBan) => {
	if (user.bot) return;
	const serverData = await serverModel.findOneAndUpdate(
		{ serverID: guild.id },
		{ $inc: { memberCount: 1 } }
	);
	if (serverData.silenceBans) return;
	try {
		await user.send(
			`${user.tag}, you were unbanned from ${guild.name}.`
		);
	} catch (err) {
		// dms not open
	}
};
