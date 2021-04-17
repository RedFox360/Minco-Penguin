const Discord = require("discord.js");
/**
 * @param {Discord.Guild} guild
 * @param {Discord.User} user
 */
module.exports = (_, guild, user) => {
	let banEmbed = new Discord.MessageEmbed()
		.setColor("F75853") // orange
		.setTitle("Banned")
		.setDescription(`${user.tag} was unbanned from ${guild.name}.`);

	guild.systemChannel.send(banEmbed);

	user.send(`${user.tag}, you were banned from ${guild.name}.`);
};
