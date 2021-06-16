const Discord = require("discord.js");
const serverModel = require("../models/serverSchema");
/** @param {Discord.GuildMember} member */
module.exports = async (client, member) => {
	var memberCount = member.guild.memberCount;
	let serverData = await serverModel.findOne({ serverID: member.guild.id });
	if (serverData.silenceJoins) return;
	let leaveMessage =
		serverData.leaveMessage ??
		"Welcome to {server}, {mention}!\nYou are the {ord_member_count} member!";

	var members = await member.guild.members.fetch();
	var memberCount = members.filter((member) => !member.user.bot).size;
	var memberCountOrdinal = ordinal(memberCount);

	leaveMessage = leaveMessage
		.replace(/\{server\}/g, guild.name)
		.replace(/\{mention\}/g, `<@${member.id}>`)
		.replace(/\{ord_member_count\}/g, memberCountOrdinal)
		.replace(/\{member_count\}/g, memberCount)
		.replace(/\{user\}/g, member.user.username)
		.replace(/\{user_tag\}/g, member.user.tag)
		.replace(/\{\}/g);
	let leaveEmbed = new Discord.MessageEmbed()
		.setColor("EC7063") // red
		.setTitle("Goodbye")
		.setDescription(`It seems ${member.user.tag} has left us. We now have ${memberCount} members.`);
	const channel = serverData.welcomeChannel
		? client.channels.cache.get(serverData.welcomeChannel)
		: member.guild.systemChannel;
	channel.send(leaveEmbed);
};
