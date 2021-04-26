const { Message } = require("discord.js");
module.exports = {
	description: "[Carrel Crew] Unlocks/locks the isolation channel",
	usage: "!isolation",
	/** @param {Message} message */
	execute(message) {
		if (message.guild.id != "785642761814671381") return "This command can only be used in Carrel Crew";
		let isolationRole = message.guild.roles.cache.get("836253125543329843");
		if (message.member.roles.cache.has(isolationRole.id)) {
			message.member.roles.remove(isolationRole);
			return `Isolation locked for user ${message.author.toString()}`;
		}
		message.member.roles.add(isolationRole);
		return `Isolation unlocked for user ${message.author.toString()}`;
	},
};
