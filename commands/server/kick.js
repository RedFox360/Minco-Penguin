const { Message } = require("discord.js");
module.exports = {
	description: "[ADMIN ONLY] Kick members",
	usage: "!kick <@user>",
	/** @param {Message} message */
	async execute(message) {
		if (!message.member.hasPermission("KICK_MEMBERS"))
			return message.channel.send("You don't have the correct permissions to execute this command");
		const mention = message.mentions.users.first();
		if (!mention) return message.channel.send("Mention a valid user");
		let memberTarget = message.guild.members.cache.get(mention.id);
		if (memberTarget.hasPermission("MANAGE_GUILD") || memberTarget.hasPermission("KICK_MEMBERS"))
			return message.channel.send("This person cannot be kicked.");
		await memberTarget.kick();
		return `${memberTarget.user.tag} was kicked from the server.`;
	},
};
