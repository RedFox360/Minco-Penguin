const { Message } = require("discord.js");
module.exports = {
	name: "kick",
	description: "[ADMIN ONLY] Kick members",
	usage: "!kick <@user>",
	/** @param {Message} message */
	execute(message) {
		if (message.member.hasPermission("KICK_MEMBERS")) {
			const mention = message.mentions.users.first();
			if (!mention) return "Mention a valid user";
			let memberTarget = message.guild.members.cache.get(mention.id);
			if (memberTarget.hasPermission("MANAGE_SERVER") && memberTarget.hasPermission("KICK_MEMBERS"))
				return message.channel.send("This person cannot be kicked.");
			memberTarget.kick();
			return `${memberTarget.tag} was kicked from the server.`;
		}
	},
};
