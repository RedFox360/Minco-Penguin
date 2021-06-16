const Discord = require("discord.js");
const serverModel = require("../models/serverSchema");
/** @param {Discord.GuildMember} member */
module.exports = async (client, member) => {
	var memberCount = member.guild.memberCount;
	let serverData = await serverModel.findOne({ serverID: member.guild.id });
	if (serverData.silenceJoins) return;
	let leaveEmbed = new Discord.MessageEmbed()
		.setColor("EC7063") // red
		.setTitle("Goodbye")
		.setDescription(`It seems ${member.user.tag} has left us. We now have ${memberCount} members.`);
	const channel = serverData.welcomeChannel
		? client.channels.cache.get(serverData.welcomeChannel)
		: member.guild.systemChannel;
	channel.send(leaveEmbed);
};
