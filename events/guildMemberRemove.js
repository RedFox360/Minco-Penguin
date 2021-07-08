const Discord = require("discord.js");
const serverModel = require("../models/serverSchema");
const ordinal = require("ordinal");
/** @param {Discord.GuildMember} member */
module.exports = async (client, member) => {
	if (member.user.bot) return;
	let serverData = await serverModel.findOneAndUpdate(
		{ serverID: member.guild.id },
		{
			$inc: {
				memberCount: +member.user.bot,
			},
		},
		{
			new: true,
		}
	);
	if (serverData.silenceJoins) return;
	const { leaveMessage, memberCount } = serverData;
	const memberCountOrdinal = ordinal(memberCount);
	let leaveEmbed = new Discord.MessageEmbed()
		.setColor("EC7063") // red
		.setTitle("Goodbye")
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
		? client.channels.cache.get(serverData.welcomeChannel)
		: member.guild.systemChannel;
	channel.send(leaveEmbed);
};
