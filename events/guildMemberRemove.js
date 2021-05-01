const Discord = require("discord.js");

/** @param {Discord.GuildMember} member */
module.exports = (_, member) => {
	var memberCount = member.guild.members.cache.filter((m) => !m.user.bot).size;

	let leaveEmbed = new Discord.MessageEmbed()
		.setColor("EC7063") // red
		.setTitle("Goodbye")
		.setDescription(`It seems ${member.user.tag} has left us. We now have ${memberCount} members.`);

	member.guild.systemChannel.send(leaveEmbed);
};
