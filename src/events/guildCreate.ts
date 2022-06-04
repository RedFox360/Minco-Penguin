import { Guild, MessageEmbed } from 'discord.js';
import serverModel from '../models/serverSchema';
export default async (guild: Guild) => {
	const members = await guild.members.fetch();
	const memberCount = members.filter(
		member => !member.user.bot
	).size;
	await serverModel.create({
		serverID: guild.id,
		bannedPeople: [],
		memberCount
	});
	const fetchedLogs = await guild.fetchAuditLogs({
		limit: 1,
		type: 'BOT_ADD'
	});
	fetchedLogs.entries
		.first()
		.executor.send({
			embeds: [
				new MessageEmbed()
					.setColor('GREEN')
					.setTitle('Thanks for me to your server!')
					.setDescription(
						'Minco Penguin now has slash commands! Try using them by typing a slash (/)'
					)
			]
		})
		.catch(() => {
			// no dm available
		});
};
