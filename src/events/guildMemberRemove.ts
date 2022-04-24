import Discord from 'discord.js';
import serverModel from '../models/serverSchema';
import ordinal from 'ordinal';

export default async (member: Discord.GuildMember) => {
	if (member.guild.bans.cache.find(ban => ban.user === member.user))
		return;
	if (member.user.bot) return;
	const amount = member.user.bot ? 0 : -1;
	const serverData = await serverModel.findOneAndUpdate(
		{ serverID: member.guild.id },
		{
			$inc: {
				memberCount: amount
			}
		},
		{
			new: true
		}
	);
	if (serverData.silenceJoins) return;
	const { leaveMessage, memberCount } = serverData;
	const memberCountOrdinal = ordinal(memberCount);
	const leaveEmbed = new Discord.MessageEmbed()
		.setColor('#EC7063') // red
		.setTitle('Goodbye')
		.setDescription(
			leaveMessage
				.replace(/\{server\}/g, member.guild.name)
				.replace(/\{mention\}/g, `<@${member.id}>`)
				.replace(/\{ord_member_count\}/g, memberCountOrdinal)
				.replace(/\{member_count\}/g, memberCount)
				.replace(/\{user\}/g, member.user.username)
				.replace(/\{user_tag\}/g, member.user.tag)
		);
	const channel = serverData.welcomeChannel
		? member.client.channels.cache.get(serverData.welcomeChannel)
		: member.guild.systemChannel;
	(channel as Discord.TextChannel).send({ embeds: [leaveEmbed] });
};
