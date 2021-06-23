const Discord = require("discord.js");
const serverModel = require("../models/serverSchema");
/**
 * @param {Discord.Guild} guild
 * @param {Discord.User} user
 */
module.exports = async (_, guild, user) => {
	let serverData = await serverModel.findOne({ serverID: guild.id });
	if (serverData.silenceBans) return;
	let banEmbed = new Discord.MessageEmbed()
		.setColor("F75853") // red
		.setTitle("Banned")
		.setDescription(`${user.tag} flew too close to the sun and was banned from ${guild.name}.`);
	const channel = serverData.welcomeChannel
		? client.channels.cache.get(serverData.welcomeChannel)
		: member.guild.systemChannel;
	guild.systemChannel.send(banEmbed);
	user.send(`${user.tag}, you were banned from ${guild.name}.`);
};
