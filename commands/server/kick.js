const { Message } = require("discord.js");
module.exports = {
	description: "[ADMIN ONLY] Kick members",
	usage: "!kick <@user>",
	/** @param {Message} message */
	execute(message, args) {
		if (!message.member.hasPermission("KICK_MEMBERS")) return "You don't have the correct permissions to execute this command";
		const reason = args.join(" ");
		const mention = message.mentions.users.first();
		if (!mention) return "Mention a valid user";
		let memberTarget = message.guild.members.cache.get(mention.id);
		if (
			memberTarget.hasPermission("MANAGE_GUILD") ||
			memberTarget.hasPermission("KICK_MEMBERS") ||
			memberTarget.roles.cache.find((r) => r.name === "Moderator")
		)
			return "This person cannot be kicked.";
		memberTarget.kick(reason);
		return `${memberTarget.user.tag} was kicked from the server.`;
	},
};
