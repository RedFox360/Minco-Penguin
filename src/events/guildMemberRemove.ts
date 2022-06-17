import Discord from 'discord.js';
import ordinal from 'ordinal';
import { updateServer } from '../functions/models';

export default (client: Discord.Client) =>
	client.on(
		'guildMemberRemove',
		async (member: Discord.GuildMember) => {
			const wasBanned = member.guild.bans.cache.some(
				ban => ban.user === member.user
			);
			if (member.user.bot) return;
			const amount = member.user.bot ? 0 : -1;
			const serverData = await updateServer(
				{ $inc: { memberCount: amount } },
				member.guild.id
			);
			if (serverData.silenceJoins) return;
			if (wasBanned) return;
			const { leaveMessage, memberCount } = serverData;
			const memberCountOrdinal = ordinal(memberCount);
			const leaveEmbed = new Discord.MessageEmbed()
				.setColor('#EC7063') // red
				.setTitle('Goodbye')
				.setDescription(
					leaveMessage
						.replace(/\{server\}/g, member.guild.name)
						.replace(/\{mention\}/g, `<@${member.id}>`)
						.replace(
							/\{ord_member_count\}/g,
							memberCountOrdinal
						)
						.replace(
							/\{member_count\}/g,
							memberCount.toLocaleString()
						)
						.replace(/\{user\}/g, member.user.username)
						.replace(/\{user_tag\}/g, member.user.tag)
				);
			const channel = serverData.welcomeChannel
				? member.client.channels.cache.get(
						serverData.welcomeChannel
				  )
				: member.guild.systemChannel;
			(channel as Discord.TextChannel).send({
				embeds: [leaveEmbed]
			});
		}
	);
