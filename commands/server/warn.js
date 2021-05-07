const { Message, MessageEmbed } = require("discord.js");
module.exports = {
	description: "[MODERATOR] Warns a user",
	usage: "!warn <@user> <reason>",
	/** @param {Message} message */
	execute(message, args) {
		if (message.member.hasPermission("MANAGE_SERVER") || message.member.roles.cache.find((role) => role.name === "Moderator")) {
			const member = message.mentions.users.first();
			if (!args.length) return "Enter valid arguments";
			if (!member) return "Mention a valid user";
			const reason = "";
			if (!args[1]) return "Enter a reason";
			for (let i = 1; i < args.length; i++) {
				reason += args[i];
			}
			const authorName = message.member.nickname || message.author.username;
			message.channel.send(
				new MessageEmbed()
					.setAuthor(authorName)
					.setTitle("Warning")
					.setDescription(`Warning for user <@${member.id}>\nReason: ${reason}`)
			);

			member.send(`${authorName} has warned you:\nReason: ${reason}`);
		} else {
			return "This command can only be used by Moderators";
		}
	},
};
