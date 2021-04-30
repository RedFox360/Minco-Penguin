const { Message } = require("discord.js");
module.exports = {
	description: "[ADMIN ONLY] Ban members",
	usage: "!ban <@user>",
	/** @param {Message} message */
	execute(message) {
		if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You don't have the correct permissions to execute this command");
		const mention = message.mentions.users.first();
		if (!mention) return message.channel.send("Mention a valid user");
		let memberTarget = message.guild.members.cache.get(mention.id);
		if (memberTarget.hasPermission("MANAGE_SERVER") || memberTarget.hasPermission("BAN_MEMBERS"))
			return message.channel.send("This person cannot be banned.");
		await memberTarget.ban();
		return `${memberTarget.tag} was banned from the server.`;
	},
};
