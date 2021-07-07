const Discord = require("discord.js");
const serverModel = require("../models/serverSchema");
const ordinal = require("ordinal");
/** @param {Discord.GuildMember} member */
module.exports = async (client, member) => {
	let serverData = await serverModel.findOne({ serverID: member.guild.id });
	if (serverData.silenceJoins) return;
	let leaveMessage = serverData.leaveMessage;

	var members = await member.guild.members.fetch();
	var memberCount = members.filter((member) => !member.user.bot).size;
	var memberCountOrdinal = ordinal(memberCount);

	leaveMessage = leaveMessage
		.replace(/\{server\}/g, member.guild.name)
		.replace(/\{mention\}/g, `<@${member.id}>`)
		.replace(/\{ord_member_count\}/g, memberCountOrdinal)
		.replace(/\{member_count\}/g, memberCount)
		.replace(/\{user\}/g, member.user.username)
		.replace(/\{user_tag\}/g, member.user.tag);
	let leaveEmbed = new Discord.MessageEmbed()
		.setColor("EC7063") // red
		.setTitle("Goodbye")
		.setDescription(leaveMessage);
	const channel = serverData.welcomeChannel
		? client.channels.cache.get(serverData.welcomeChannel)
		: member.guild.systemChannel;
	channel.send(leaveEmbed);
};
