const Discord = require("discord.js");
/**
 * @param {Discord.Guild} guild
 * @param {Discord.User} user
 */
module.exports = async (_, guild, user) => {
	let serverData = await serverModel.findOne({ serverID: member.guild.id });
	let unbanEmbed = new Discord.MessageEmbed()
		.setColor("F75853") // red
		.setTitle("Banned")
		.setDescription(`${user.tag} flew too close to the sun and was banned from ${guild.name}.`);
	const channel = serverData.welcomeChannel
		? client.channels.cache.get(serverData.welcomeChannel)
		: member.guild.systemChannel;
	guild.systemChannel.send(unbanEmbed);
	user.send(`${user.tag}, you were banned from ${guild.name}.`);
};
