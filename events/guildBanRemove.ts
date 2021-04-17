import * as Discord from "discord.js";

export default (_, guild: Discord.Guild, user: Discord.User) => {
	let banEmbed = new Discord.MessageEmbed()
		.setColor("F75853") // orange
		.setTitle("Banned")
		.setDescription(`${user.tag} was unbanned from ${guild.name}.`);

	guild.systemChannel.send(banEmbed);

	user.send(`${user.tag} you were banned from ${guild.name}.`);
};
