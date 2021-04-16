const Discord = require("discord.js");
/**
 * @param {Discord.Guild} guild
 * @param {Discord.User} user
 */
module.exports = (_, guild, user) => {
	let unbanEmbed = new Discord.MessageEmbed()
		.setColor("F75853") // red
		.setTitle("Banned")
		.setDescription(
			`${user.tag} flew too close to the sun and was banned from ${guild.name}.`
		);

	guild.systemChannel.send(unbanEmbed);
	user.send(`${user.tag}, you were unbanned from ${guild.name}.`);
};
